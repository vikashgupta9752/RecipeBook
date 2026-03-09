import { useEffect, useState } from "react";
import api from "../../services/api";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/contact")
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg._id} className="p-4 bg-stone-800 rounded">
              <p><b>Name:</b> {msg.name}</p>
              <p><b>Email:</b> {msg.email}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
