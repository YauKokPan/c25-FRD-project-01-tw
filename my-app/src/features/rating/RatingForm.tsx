import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import "./RatingForm.css";
import { useParams } from "react-router-dom";
import { Hotel, UseHotelInfo } from "../hotel/hotelAPI";

const labels: { [index: string]: string } = {
  1: "極差",
  2: "差勁",
  3: "尚可",
  4: "非常好",
  5: "完美",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function RatingForm() {
  const [value, setValue] = React.useState<number | null>(2);
  const [hover, setHover] = React.useState(-1);
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(
      `Thank you ${name} for submitting your rating of ${value} stars and your comment: ${comment}`
    );
  };

  return (
    <div className="rating-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          <div className="sub-title">你的暱稱🙆‍♀️:</div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="sub-title">你的評分💯:</div>
        <Box
          sx={{
            width: 200,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Rating
            name="size-large"
            defaultValue={2}
            size="large"
            value={value}
            precision={1}
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
            }
          />
          {value !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
          )}
        </Box>
        <label htmlFor="comment">
          <div className="sub-title">你的留言🗣️:</div>
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
    </div>
  );
}
