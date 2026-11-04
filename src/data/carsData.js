export const CARS_DATA = [
  {
    id: "toyota-corolla",
    name: "Toyota Corolla",
    pricePerDay: 40,
    priceDisplay: "$40 / Day",
    image: "/corolla.png",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    pricePerDay: 80,
    priceDisplay: "$80 / Day",
    image: "/Fortuner.png",
    type: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
  },
  {
    id: "honda-civic",
    name: "Honda Civic",
    pricePerDay: 50,
    priceDisplay: "$50 / Day",
    image: "/honda.png",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
  },
  {
    id: "mercedes-benz",
    name: "Mercedes Benz",
    pricePerDay: 100,
    priceDisplay: "$100 / Day",
    image: "/mercedes.png",
    type: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
  },
  {
    id: "bmw-5-series",
    name: "BMW 5 Series",
    pricePerDay: 95,
    priceDisplay: "$95 / Day",
    image: "/BMW_5_series.png",
    type: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
  },
  {
    id: "land-cruiser",
    name: "Land Cruiser",
    pricePerDay: 120,
    priceDisplay: "$120 / Day",
    image: "/land.png",
    type: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
  },
  {
    id: "audi",
    name: "Audi",
    pricePerDay: 70,
    priceDisplay: "$70 / Day",
    image: "/Audi.png",
    type: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
  },
  {
    id: "toyota-crown",
    name: "Toyota Crown",
    pricePerDay: 150,
    priceDisplay: "$150 / Day",
    image: "/Crown.png",
    type: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
  },
];

export const getCarByName = (name) => {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return CARS_DATA.find((c) => c.name.toLowerCase() === normalized) || null;
};

export const getCarById = (id) => {
  if (!id) return null;
  return CARS_DATA.find((c) => c.id === id) || null;
};

