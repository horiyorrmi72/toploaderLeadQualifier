import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
dotenv.config();
import { retellClient } from './utils/client';
import axios from 'axios';
import cron from 'node-cron';

const port = process.env.PORT || 4500;
const app = express();
app.use(express.json({ limit: '250mb' }));

const handleErrors = (err: any, res: Response) => {
    if (err instanceof Error) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
};

const handleRouteError = async (req: Request, res: Response, callback: () => Promise<any>) => {
    try {
        const result = await callback();
        return res.status(200).json(result);
    } catch (err) {
        handleErrors(err, res);
    }
};

const makeCall = async (name: string, phoneNumber: string, email: string) => {
    const phoneCallResponse = await retellClient.call.createPhoneCall({
        from_number: process.env.OUTBOUND_PHONE_NUMBER,
        to_number: phoneNumber,
        override_agent_id: process.env.AGENT_ID,
        metadata: { name, email, phoneNumber },
        retell_llm_dynamic_variables: { name, phoneNumber, email }
    });
    console.log(phoneCallResponse);
    return phoneCallResponse;
}

app.post('/booker', async (req: Request, res: Response) => {
    handleRouteError(req, res, async () => {
        const {
            eventTypeId = process.env.cal_eventTypeId,
            start,
            name,
            email,
            timeZone,
            language = "en",
            customField
        } = req.body;

        if (!start || !name || !email || !timeZone) {
            throw new Error('Missing required fields');
        }

        const data = {
            start,
            eventTypeId: parseInt(eventTypeId),
            attendee: {
                name,
                email,
                timeZone,
                language,
            },
            bookingFieldsResponses: {
                customField
            }
        }

        const appointment = await axios.post('https://api.cal.com/v2/bookings', data, {
            headers: {
                Authorization: `Bearer ${process.env.CAL_API_TOKEN}`,
                'cal-api-version': '2024-08-13',
                'Content-Type': 'application/json',
            }
        });

        return appointment.data;
    });
});

app.post('/makeCall', async (req: Request, res: Response) => {
    handleRouteError(req, res, async () => {
        const { name, phoneNumber, email } = req.body;
        const callResponse = await makeCall(name, phoneNumber, email);
        return { message: 'Call initiated successfully', callResponse };
    });
});


//keeping the server alive
app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Agent is active 😇' });
})
// cron.schedule('0 30 * * * *', () => {
//     console.log('keeping this server alive 😇');
// }, { scheduled: true })

app.listen(port, () => {
    console.log(`Lead qualifier server listening on port: ${port}`);
});