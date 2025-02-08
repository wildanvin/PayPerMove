"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home = () => {
  const { address: connectedAddress } = useAccount();
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    // Add user message to chat
    setMessages(prev => [...prev, { user: "You", text: inputText }]);

    // Simulate LLM response (replace with API call later)
    const llmResponse = `PayPer Move: Sure, but it'll cost you 0.01 ETH. What, you thought robots work for free? Pay up, and I'll make it happen. 💸🤖`;
    setTimeout(() => {
      setMessages(prev => [...prev, { user: "PayPer Move", text: llmResponse }]);
    }, 1000);

    // Clear input
    setInputText("");
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        {/* <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">PayPer Move</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div> */}

        {/* Chat Interface */}
        <div className="flex-grow bg-base-300 w-full mt-2 px-1 py-5">
          <div className="max-w-2xl mx-auto ">
            {/* Chat Messages */}
            <div className="bg-base-100 rounded-lg p-6 h-[400px] overflow-y-auto mb-4 ">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.user === "You" ? "text-right" : "text-left"}`}>
                  <span className="font-bold text-secondary">{msg.user}:</span>{" "}
                  <p className="mt-1 bg-base-200 p-2 rounded-lg inline-block">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered w-full"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleSendMessage()}
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
