import React from "react";
import { useParams } from "react-router-dom";
import Title from "./Title";

export default function HotelDetail() {
  let params = useParams();

  return (
    <div>
      <Title mainTitle="酒店資料"/>
      #{params.id}Hotel Detail
    </div>
  );
}
