"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home = () => {
  const { address: connectedAddress } = useAccount();
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useScaffoldWriteContract("RobotPayment");

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message to chat
    setMessages(prev => [...prev, { user: "You", text: inputText }]);

    // Clear input
    setInputText("");

    // Call the API
    setIsLoading(true);
    try {
      const response = await fetch("/api/getCompletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: inputText }),
      });

      if (!response.ok) {
        throw new Error("Error fetching completion");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { user: "PayPer Move", text: data.message }]);

      // Check if the response includes a payment request
      const ethRegex = /(\d+\.\d+) ETH/;
      const match = data.message.match(ethRegex);
      if (match) {
        setPaymentAmount(match[1]); // Set the payment amount
      } else {
        setPaymentAmount(null); // Reset payment amount
      }
    } catch (error) {
      console.error("Error fetching completion:", error);
      setMessages(prev => [
        ...prev,
        { user: "PayPer Move", text: "Oops! Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentAmount) return;

    try {
      await writeContractAsync(
        {
          functionName: "payForAction",
          value: parseEther(paymentAmount),
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
            setMessages(prev => [
              ...prev,
              { user: "PayPer Move", text: `Payment of ${paymentAmount} ETH successful! Processing your request...` },
            ]);
            setPaymentAmount(null); // Reset payment amount after successful payment
          },
        },
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      setMessages(prev => [...prev, { user: "PayPer Move", text: "Payment failed. Please try again." }]);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        {/* Chat Interface */}
        <div className="flex-grow bg-base-300 w-full mt-2 px-1 py-5">
          <div className="max-w-2xl mx-auto">
            {/* Chat Messages */}
            <div className="bg-base-100 rounded-lg p-6 h-[400px] overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.user === "You" ? "text-right" : "text-left"}`}>
                  <span className="font-bold text-secondary">{msg.user}:</span>
                  <p className="mt-1 bg-base-200 p-2 rounded-lg inline-block">{msg.text}</p>
                </div>
              ))}
              {isLoading && (
                <div className="text-left">
                  <span className="font-bold text-secondary">PayPer Move:</span>
                  <div className="mt-1 bg-base-200 p-2 rounded-lg inline-block">
                    <svg
                      className="animate-spin h-5 w-5 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
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
                disabled={isLoading}
              />
              <button className="btn btn-primary" onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Payment Button */}
            {paymentAmount && (
              <div className="mt-4 text-center">
                <button className="btn btn-success" onClick={handlePayment} disabled={isPending}>
                  {isPending ? "Processing..." : `Pay ${paymentAmount} ETH`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
