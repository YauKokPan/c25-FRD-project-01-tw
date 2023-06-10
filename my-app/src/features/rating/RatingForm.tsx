import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
// import StarIcon from "@mui/icons-material/Star";
import "./RatingForm.css";
import { Hotel } from "../hotel/hotelAPI";
import { getUserId } from "../auth/authAPI";
import { fetchComments, ratingAPI } from "./ratingAPI";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";

const labels: { [index: string]: string } = {
  1: "極差",
  2: "差勁",
  3: "尚可",
  4: "非常好",
  5: "完美",
};

function getLabelText(value: number) {
  return `${value} Heart${value !== 1 ? "s" : ""}`;
}

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const RatingForm: React.FC<{ hotel: Hotel }> = (props) => {
  const hotel = props.hotel;
  const userID = Number(getUserId());

  const [value, setValue] = React.useState<number | null>(0);
  const [hover, setHover] = React.useState(-1);
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");

  const [displayComments, setDisplayComments] = React.useState<
    Array<{ nick_name: string; comment_text: string; rating: number }>
  >([]);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("form submitted");

    try {
      // Call the ratingAPI function
      const response = await ratingAPI(
        userID,
        hotel.id,
        name,
        comment,
        value as number
      );

      // Process the response and set the displayComment state
      console.log("Response status:", response.status);
      if (response.ok) {
        const responseBody = await response.json();
        console.log("Response body:", responseBody);
        const newComment = {
          nick_name: responseBody.nick_name,
          comment_text: responseBody.comment_text,
          rating: responseBody.rating,
        };
        setDisplayComments((prevDisplayComments) => [
          ...prevDisplayComments,
          newComment,
        ]);
      } else {
        setApiError(
          response.statusText ||
            "An error occurred while submitting your rating."
        );
      }
      console.log("After response status check");

      // Clear the form fields
      setName("");
      setComment("");
      setValue(0);
    } catch (error) {
      setApiError("An error occurred while submitting your rating.");
    }
  };

  React.useEffect(() => {
    const fetchAndSetComments = async () => {
      try {
        const comments = await fetchComments(hotel.id);
        setDisplayComments(comments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetComments();
  }, [hotel.id]);

  return (
    <div className="rating-form">
      <h2>發表評論👍</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          <div className="sub-title">暱稱🙆‍♀️</div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="sub-title">評分💯</div>
        <Box
          sx={{
            width: 200,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <StyledRating
            name="customized-color"
            defaultValue={0}
            size="large"
            value={value}
            precision={1}
            icon={<FavoriteIcon fontSize="inherit" />}
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
          {value !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value!]}</Box>
          )}
        </Box>
        <label htmlFor="comment">
          <div className="sub-title">留言🗣️</div>
          <textarea
            id="comment"
            rows={5}
            cols={40}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {apiError && (
        <Alert severity="warning">
          <AlertTitle>注意</AlertTitle>
          <strong>請先登入以發佈評論！</strong>
        </Alert>
      )}
      <div className="comment-section">
        {displayComments.map((comment, index) => (
          <div key={index} className="comment">
            <div className="comment-nickname">
              Nickname: {comment.nick_name}
            </div>
            <div className="comment-text">Comment: {comment.comment_text}</div>
            <div className="comment-rating">Rating: {comment.rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingForm;
