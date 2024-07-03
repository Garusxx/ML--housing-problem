import React, { useEffect } from "react";
import { useState } from "react";

const useGetHousing = () => {
  const [loading, setLoading] = useState(false);
  const [housingData, setHousingData] = useState([]);

  useEffect(() => {
    const getHosingData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/getHousing");
        const data = await response.json();
        setHousingData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getHosingData();
  }, []);

  return { loading, housingData };
};


export default useGetHousing;
