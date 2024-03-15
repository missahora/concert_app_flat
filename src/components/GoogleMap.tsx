// reference: https://zenn.dev/kou_kawa/articles/11-next-ts-googlemap
// https://zenn.dev/kou_kawa/articles/12-next-ts-googlemap2

"use client";
import React, { useEffect, useRef, useState } from "react";

// 初期化用の定数
const INITIALIZE_LAT = 35.68238; // 緯度
const INITIALIZE_LNG = 139.76556; // 経度
const INITIALIZE_ZOOM = 15; // ズームレベル

const INITIALIZE_MAP_WIDTH = "100%"; // 地図の幅
const INITIALIZE_MAP_HEIGHT = "400px"; // 地図の高さ

const GoogleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  ); // 緯度経度state

  const [shops, setShops] = useState<google.maps.places.PlaceResult[]>([]); // 周辺店舗state

  useEffect(() => {
    if (!mapRef.current) return;

    const initializedMap = new google.maps.Map(mapRef.current, {
      center: { lat: INITIALIZE_LAT, lng: INITIALIZE_LNG },
      zoom: INITIALIZE_ZOOM,
    });

    setMap(initializedMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    // クリックリスナー追加
    map.addListener("click", (event) => {
      // 緯度経度の取得
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      setLocation({ lat: latitude, lng: longitude });

      // 店舗データの取得
      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: { lat: latitude, lng: longitude },
          radius: 1000, // 検索範囲（メートル）
          type: "store", // 店舗を検索
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setShops(results);
          }
        }
      );
    });
  }, [map]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }}
      />

      {/** 緯度経度表示 */}
      {location && (
        <div className="mx-5 my-5">
          <h2 className="underline text-lg mb-3">Location</h2>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}

      {/** 店舗リストの表示 */}
      {shops.length > 0 && (
        <div className="mx-5 mb-5">
          <h2 className="underline text-lg mb-3">Nearby Stores</h2>
          <ul className="list-disc list-inside">
            {shops.map((shop, index) => (
              <li key={index}>{shop.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
