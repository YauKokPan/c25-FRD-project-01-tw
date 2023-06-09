import "./RatingForm.css";

import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Hotel } from "../hotel/hotelAPI";
import { getUserId } from "../auth/authAPI";
import { fetchComments, ratingAPI } from "./ratingAPI";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const labels: { [index: string]: string } = {
  1: "極差",
  2: "差勁",
  3: "尚可",
  4: "非常好",
  5: "完美",
};

const CommentSectionBox = styled(Box)(({ theme }) => ({
  width: "100%",
  borderRadius: "10px",
  padding: "10px",
  backgroundColor: theme.palette.background.default,
}));

function getLabelText(value: number) {
  return `${value} Heart${value !== 1 ? "s" : ""}`;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

const parseDateString = (dateString: string) => {
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    // Handle invalid date format
    console.error(`Invalid date format: ${dateString}`);
    return new Date(); // Return the current date as a fallback
  }
  return parsedDate;
};

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

type RatingFormProps = {
  isAuth: any;
  hotel: Hotel;
};
const RatingForm: React.FC<RatingFormProps> = (props) => {
  const recaptchaRef = React.createRef<ReCAPTCHA>();
  const navigate = useNavigate();
  const hotel = props.hotel;
  const isAuth = props.isAuth;

  const userID = Number(getUserId());

  const [value, setValue] = React.useState<number | null>(0);

  const [hover, setHover] = React.useState(-1);
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");

  const getInitialDailyCommentCount = () => {
    const storedCount = localStorage.getItem("dailyCommentCount");
    return storedCount ? parseInt(storedCount, 10) : 0;
  };

  const [dailyCommentCount, setDailyCommentCount] = React.useState<number>(
    getInitialDailyCommentCount()
  );

  const checkDailyCommentLimitReached = () => dailyCommentCount >= 5;

  const [displayComments, setDisplayComments] = React.useState<
    Array<{
      nick_name: string;
      comment_text: string;
      rating: number;
      createdAt: Date;
    }>
  >([]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleRecaptchaVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (recaptchaRef.current) {
      const recaptchaValue = recaptchaRef.current.getValue();

      // Check the recaptchaValue and proceed with the handleSubmit if it's valid
      if (recaptchaValue) {
        if (checkDailyCommentLimitReached()) {
          setIsSubmitting(false);
          Swal.fire("你每天只能發表5條評論。");
          return;
        }
        handleSubmit();
        Swal.fire("發表評論成功！");
      } else {
        Swal.fire("recaptcha驗證失敗，請重試");
      }
    } else {
      Swal.fire("recaptcha驗證失敗，請重試");
    }
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
      setIsSubmitting(true);
    } else {
      Swal.fire("發表評論失敗！");
    }

    // Call the ratingAPI function
    const response = await ratingAPI(
      userID,
      hotel.id,
      name,
      comment,
      value as number
    );

    // Process the response and set the displayComment state

    if (response.ok) {
      const responseBody = await response.json();

      const newComment = {
        nick_name: responseBody.nick_name,
        comment_text: responseBody.comment_text,
        rating: responseBody.rating,
        createdAt: responseBody.created_at,
      };

      const parsedNewComment = {
        ...newComment,
        createdAt: parseDateString(newComment.createdAt),
      };
      setDisplayComments((prevDisplayComments) => [
        ...prevDisplayComments,
        parsedNewComment,
      ]);

      const updatedDailyCommentCount = dailyCommentCount + 1;
      setDailyCommentCount(updatedDailyCommentCount);
      localStorage.setItem(
        "dailyCommentCount",
        updatedDailyCommentCount.toString()
      );
    }

    // Clear the form fields
    setName("");
    setComment("");
    setValue(0);

    setIsSubmitting(false);
  };

  React.useEffect(() => {
    const fetchAndSetComments = async () => {
      try {
        const comments = await fetchComments(hotel.id);
        const parsedComments = comments.map(
          (comment: {
            nick_name: string;
            comment_text: string;
            rating: number;
            createdAt: string;
          }) => ({
            ...comment,
            createdAt: parseDateString(comment.createdAt),
          })
        );
        setDisplayComments(parsedComments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetComments();
  }, [hotel.id]);

  // Reset the dailyCommentCount after 24 hours
  React.useEffect(() => {
    const resetDailyCommentCount = () => {
      setDailyCommentCount(0);
      localStorage.removeItem("dailyCommentCount");
    };

    const now = new Date().getTime();
    const storedResetTime = localStorage.getItem("resetTime");

    // If there's no stored reset time, set it to 24 hours from now
    if (!storedResetTime) {
      const resetTime = now + 24 * 60 * 60 * 1000;
      localStorage.setItem("resetTime", resetTime.toString());
    }

    const timeUntilReset =
      parseInt(localStorage.getItem("resetTime") as string, 10) - now;
    const resetTimer = setTimeout(resetDailyCommentCount, timeUntilReset);

    return () => {
      clearTimeout(resetTimer);
    };
  }, []);

  const addEmoji = (emoji: string) => () => {
    setComment((prevComment) => prevComment + emoji);
  };

  if (!isAuth) {
    return (
      <>
        <div className="btn-center">
          <Button
            color="warning"
            size="lg"
            onClick={function () {
              navigate("/login");
            }}
            variant="soft"
          >
            請先登錄以發表評論
          </Button>
        </div>
        <CommentSectionBox
          className={`comment-section ${
            displayComments.length > 0 ? "commentSectionBackground" : ""
          }`}
          sx={{
            backgroundColor:
              displayComments.length > 0 ? "#f5f0f0" : "transparent",
          }}
        >
          {displayComments.map((comment, index) => (
            <Box
              key={index}
              className="comment"
              sx={{
                marginBottom: 2,
                borderBottom:
                  index !== displayComments.length - 1
                    ? "1px solid #ccc"
                    : "none",
                paddingBottom: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                {comment.nick_name}
              </Typography>
              <Box>
                <Typography
                  variant="body1"
                  component="span"
                  gutterBottom
                ></Typography>
                <Rating
                  value={comment.rating}
                  precision={0.5}
                  readOnly
                  icon={<FavoriteIcon style={{ color: "#ff6d75" }} />}
                  emptyIcon={
                    <FavoriteIcon style={{ opacity: 0.2, color: "#ff3d47" }} />
                  }
                  sx={{ marginLeft: 0 }}
                />
              </Box>
              <Typography variant="body1" gutterBottom>
                {comment.comment_text}
              </Typography>

              <Typography variant="body2">
                {formatDate(new Date(comment.createdAt))}
              </Typography>
            </Box>
          ))}
        </CommentSectionBox>
      </>
    );
  } else {
    return (
      <div className="rating-form">
        <form onSubmit={handleRecaptchaVerification}>
          <label htmlFor="name">
            <div className="sub-title">暱稱🙆‍♀️</div>
            <Textarea
              color="warning"
              className="comment-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{
                width: {
                  xs: "100%",
                  sm: "130%",
                  md: "170%",
                  lg: "230%",
                  xl: "270%",
                },
              }}
              required
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
              onChange={(_event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(_event, newHover) => {
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
            <Textarea
              color="warning"
              required
              className="comment-input"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              minRows={2}
              maxRows={4}
              sx={{
                width: {
                  xs: "100%",
                  sm: "130%",
                  md: "170%",
                  lg: "230%",
                  xl: "270%",
                },
                minHeight: { xs: "60px", sm: "80px" },
              }}
              startDecorator={
                <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
                  <IconButton
                    variant="outlined"
                    color="neutral"
                    onClick={addEmoji("👍")}
                  >
                    👍
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="neutral"
                    onClick={addEmoji("😂")}
                  >
                    😂
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="neutral"
                    onClick={addEmoji("😍")}
                  >
                    😍
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="neutral"
                    onClick={addEmoji("☹️")}
                  >
                    ☹️
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="neutral"
                    onClick={addEmoji("😓")}
                  >
                    😓
                  </IconButton>
                </Box>
              }
            />
          </label>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdF9owmAAAAAIil4OgvbkKJQwW-0yY5UAr-PcVE"

            // asyncScriptOnLoad={asyncScriptOnLoad}
          />
          <div>
            {/* <button type="submit">Submit</button> */}
            <Button
              type="submit"
              disabled={isSubmitting}
              color="warning"
              size="md"
            >
              提交
            </Button>
          </div>
        </form>
        <CommentSectionBox
          className={`comment-section ${
            displayComments.length > 0 ? "commentSectionBackground" : ""
          }`}
          sx={{
            backgroundColor:
              displayComments.length > 0 ? "#f5f0f0" : "transparent",
          }}
        >
          {displayComments.map((comment, index) => (
            <Box
              key={index}
              className="comment"
              sx={{
                marginBottom: 2,
                borderBottom:
                  index !== displayComments.length - 1
                    ? "1px solid #ccc"
                    : "none",
                paddingBottom: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                {comment.nick_name}
              </Typography>
              <Box>
                <Typography
                  variant="body1"
                  component="span"
                  gutterBottom
                ></Typography>
                <Rating
                  value={comment.rating}
                  precision={0.5}
                  readOnly
                  icon={<FavoriteIcon style={{ color: "#ff6d75" }} />}
                  emptyIcon={
                    <FavoriteIcon style={{ opacity: 0.2, color: "#ff3d47" }} />
                  }
                  sx={{ marginLeft: 0 }}
                />
              </Box>
              <Typography variant="body1" gutterBottom>
                {comment.comment_text}
              </Typography>

              <Typography variant="body2">
                {formatDate(new Date(comment.createdAt))}
              </Typography>
            </Box>
          ))}
        </CommentSectionBox>
      </div>
    );
  }
};

export default RatingForm;
