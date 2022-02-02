import LinearGradient from 'react-native-linear-gradient';

export const COLORS = {
  primary: "#DA251C",
  secondary: "#F07D00",
  lightBg: "#F0F4F8",

}
export const BTN_STYLE = { borderRadius: 30, paddingVertical: 15, marginHorizontal: 24 };
export const DATA_LIST = [
  {
    id: '1',
    title: 'First Item',
  },
  {
    id: '2',
    title: 'Second Item',
  },
  {
    id: '3',
    title: 'Third Item',
  },
];
export const CATS = [
  {
    id: '2',
    title: 'Italian',
  },
  {
    id: '3',
    title: 'Indian',
  },
  {
    id: '5',
    title: 'Vegan'
  },
  {
    id: '4',
    title: 'Turkish',
  },
  {
    id: '6',
    title: 'Canadian'
  },
  {
    id: '7',
    title: 'Chineese'
  }, {
    id: '8',
    title: 'Persian'
  }
];
export const TEXT = {
  lableStyle: {
    fontSize: 14,
    color: "white"
  }
}
export const shadowStyle = {
  shadowOpacity: 1,
}
export const INPUT = {
  backgroundStyle: {
    marginTop: 10,
    backgroundColor: '#F0F4F8',
    height: 60,
    borderRadius: 5,
    marginHorizontal: 24,
    flexDirection: 'row'
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    color: '#748a9d',
    fontWeight: "bold"
  },
  iconStyle: {
    fontSize: 24,
    alignSelf: 'center',
    marginHorizontal: 16,
    color: "gray",
    opacity: 0.5,

  }
}

export const MAP_STYLE = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]

export const GOOGLE_API_KEY = "AIzaSyDjUB-i3JWraUXBNqnaPF46eLNY19WRqNk";
export const IOS_CLIENT_ID = "1024636068679-rdpsupc9l3387avjtg8dah7h7k2nm705.apps.googleusercontent.com";
export const ANDROID_CLIENT_ID = "1024636068679-i22effhlg1lg9amd0dvko1sn6v2qpob1.apps.googleusercontent.com";
// export const ANDROID_CLIENT_ID = "024636068679-h0l6d4tpa1efmko2dqkre26jjoasjvpd.apps.googleusercontent.com"
// export const FACEBOOK_APP_ID = "208849114365446";
// export const FACEBOOK_APP_ID = "792649934682493";

// New Facebook id
export const FACEBOOK_APP_ID = 1106805299811744;

export const CONFIG = {
  iosClientId: IOS_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
  behavior: "web",
  success: ["profile", "email"]
}
