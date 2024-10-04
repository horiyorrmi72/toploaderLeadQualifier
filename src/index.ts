import dotenv from 'dotenv';
import express,{Request, Response} from 'express';
dotenv.config();
import { retellClient } from './utils/client';

const port = process.env.PORT || 4500;
const app = express();
app.use(express.json({ limit: '250mb' }));

const makeCall = async (name: string, phone: string, email: string) => {
    const phoneCallResponse = await retellClient.call.createPhoneCall({
        from_number: process.env.OUTBOUND_PHONE_NUMBER,
        to_number: phone,
        override_agent_id: process.env.AGENT_ID,
        metadata: { name, email },
        retell_llm_dynamic_variables: { name, phone, email }
    });
    // console.log(phoneCallResponse);
    return phoneCallResponse;
}

const generalWebhook = async (req: Request, res: Response) => {
    const data = req.body.data;
    if (data.direction === 'inbound') {
        console.log('Inbound call webhook:', data);
    } else {
        console.log('Outbound call webhook:', data);
    }
    res.status(200).end();
}

app.post('/makeCall', async (req:Request, res:Response) => {
    try {
        const { name, phone, email } = req.body;
        const callResponse = await makeCall(name, phone, email);
        return res.status(200).json({ message: 'Call initiated successfully', data: callResponse });
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.status(500).json({ message: err.message });
        }
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/genWebhook', generalWebhook);

app.listen(port, () => {
    console.log(`Lead qualifier server listening on port: ${port}`);
});
