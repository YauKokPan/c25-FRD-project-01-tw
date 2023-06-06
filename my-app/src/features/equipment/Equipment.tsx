import React from 'react'
import { TbWifi } from "react-icons/tb";
import { GiWaterBottle ,GiSlippers ,GiTowel} from "react-icons/gi"
import { TbAirConditioning } from "react-icons/tb";
import "./Equipment.css";
import Title from "../title/Title";

export default function Equipment() {
  return (
    <div className='equipment'>
      <div className='equipment-title'>酒店設備</div>
      <div className='equipment-icons'>
        <div className='equipment-item'>
          <TbWifi />
          <p>Wifi</p>
        </div>
        <div className='equipment-item'>
          <GiWaterBottle />
          <p>水</p>
        </div>
        <div className='equipment-item'>
          <GiTowel />
          <p>毛巾</p>
        </div>
        <div className='equipment-item'>
          <TbAirConditioning />
          <p>冷氣</p>
        </div>
      </div>
    </div>
  );
}