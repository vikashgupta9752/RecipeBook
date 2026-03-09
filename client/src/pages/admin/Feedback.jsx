import { useEffect, useState } from "react";
import api from "../../services/api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    api.get("/feedback")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Feedback</h1>

      {feedbacks.length === 0 ? (
        <p>No feedback found</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(fb => (
            <div key={fb._id} className="p-4 bg-stone-800 rounded">
              <p><b>User:</b> {fb.user?.username}</p>
              <p><b>Rating:</b> {fb.rating}</p>
              <p>{fb.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
