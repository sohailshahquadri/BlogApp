import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BaseUrl, get, post } from '../services/Endpoint';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function Blog() {
  const { postId } = useParams(); // Assuming you're passing the post ID in the route
  const user = useSelector((state) => state.auth.user);

  const [singlePost, setSinglePost] = useState(null);
  const [comment, setComment] = useState('');
  const [loaddata, setLoaddata] = useState(false);

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const request = await get(`/public/Singlepost/${postId}`);
        const response = request.data;
        setSinglePost(response.Post);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePost();
  }, [loaddata, postId]); // Added postId as dependency

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please Login');
    } else {
      try {
        const request = await post("/comment/addcomment", {
          comment,
          postId,
          userId: user._id,
        });
        const response = request.data;
        console.log(response);
        setLoaddata((prevState) => !prevState); // Toggle loaddata
        if (response.success) {
          toast.success(response.message);
          setComment('');
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="container text-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-12">
          <h1 className="fw-bold text-white mb-4 display-4">
            {singlePost ? singlePost.title : 'Loading...'}
          </h1>

          {singlePost && singlePost.image && (
            <img 
              src={`${BaseUrl}/images/${singlePost.image}`} 
              alt="Exploring the Art of Writing" 
              className="img-fluid mb-4" 
              style={{ borderRadius: "10px", maxHeight: "500px", objectFit: "cover", width: "100%" }}
            />
          )}

          {singlePost ? (
            <p className="mb-5">{singlePost.desc}</p>
          ) : (
            <p>Loading post description...</p>
          )}

          <hr />

          <h3 className="mt-5 mb-4">Leave a Comment</h3>
          <form onSubmit={onSubmitComment}>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Comment</label>
              <textarea 
                className="form-control" 
                id="comment" 
                rows="4" 
                placeholder="Write your comment here" 
                required
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Comment</button>
          </form>

          <hr />

          <h3 className="mt-5 mb-4">Comments</h3>
          {singlePost && singlePost.comments ? (
            singlePost.comments.map((elem) => (
              <div key={elem._id} className="bg-secondary p-3 rounded mb-3 d-flex">
                <img 
                  src={`${BaseUrl}/images/${elem.userId.profile}`} 
                  alt={elem.userId.FullName} 
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div>
                  <h5 className="mb-1">{elem.userId.FullName}</h5>
                  <p className="mb-0">{elem.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
