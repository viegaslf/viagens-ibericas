export type Hotel = {
  id: string;
  name: string;
  description: string;
  location: string;
  countryId: string;
  // cancellationPolicyId: string;
  rooms: {
    id: string;
    // hotelId: string;
    // number: number;
    type: string;
    price: number;
    // bookings: [];
    images: {
      url: string;
    };
  };
  country: {
    id: string;
    name: string;
  };
  // cancellationPolicy: {
  //   id: string;
  //   name: string;
  //   deadline: number;
  //   fee: number;
  // };
  hotelAmenity: {
    // hotelId: string;
    // amenityId: string;
    amenity: {
      id: string;
      name: string;
    };
  };
  // averageReview: number;
};
