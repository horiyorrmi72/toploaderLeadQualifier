import { AgentResponse, Llm, LlmResponse } from 'retell-sdk/resources';
import { retellClient } from '../utils/client';


export const createLlmresponse = async () => {

    const llm: LlmResponse = await retellClient.llm.create({
        general_prompt: `Your name is Colin and you're part of the GTM (Go to market) team at Toploader Real Estate Agency. Your job is to call and qualify inbound leads right after they submit an inquiry on the Toploader website. The lead might be suprised that you're calling so soon, given that they just submitted the form. That's okay. If asked, explain that you are an AI phone agent, and that your job is to provdide support to Toploader real estatae agency customers. 
        Greeting the Lead
          Answer all inbound calls within 5 minutes of form submission
          Greet the lead in a friendly, upbeat tone
          Introduce yourself by first name and company
          Confirm you are speaking with the lead by referencing the form they filled out
          Thank them for taking the time to reach out to Bland AI`,
        general_tools: [
            {
                type: "end_call",
                name: "end_call",
                description:
                    "End the call with user only when user explicitly requests it.",
            },
        ],
        states: [
            {
                name: "information_collection",
                state_prompt: "You will follow the steps below to collect information...",
                edges: [
                    {
                        destination_state_name: "appointment_booking",
                        description:
                            "Transition to book an appointment if the user is due for an annual checkup based on the last checkup time collected.",
                    },
                ],
                tools: [
                    {
                        type: "transfer_call",
                        name: "transfer_to_support",
                        description:
                            "Transfer to the support team when user seems angry or explicitly requests a human agent",
                        number: "16175551212",
                    },
                ],
            },
            {
                name: "appointment_booking",
                state_prompt: "You will follow the steps below to book an appointment...",
                tools: [
                    {
                        type: "book_appointment_cal",
                        name: "book_appointment",
                        description:
                            "Book an annual check up when user provided name, email, phone number, and have selected a time.",
                        cal_api_key: "cal_live_xxxxxxxxxxxx",
                        event_type_id: 60444,
                        timezone: "America/Los_Angeles",
                    },
                ],
            },
        ],
        starting_state: "information_collection",
        begin_message: "Hey I am a virtual assistant calling from Retell Hospital.",
    });

    console.log(llm);
}

export const createAgent = async () => {
    // const agent: AgentResponse = await retellClient.agent.create({
    //     llm_websocket_url: "wss://f1b6-154-117-119-85.ngrok-free.app/genWebhook/",
    //     voice_id: "11labs-Anthony",
    //     agent_name: "agent_08c3db3725215a9acab7d70574",
    // })
    const agent: AgentResponse = await retellClient.agent.create({
        voice_id: "11labs-Anthony",
        agent_name: "Anthony",
        llm_websocket_url: "",
    });
    console.log(agent);

    console.log(agent);
}
createAgent()