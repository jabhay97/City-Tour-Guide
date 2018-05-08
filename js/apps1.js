var map; //Global variable map

function mapError() {
    document.getElementById('map').innerHTML = "Their is an error loading the map"; // if map doesnt load successfully
}

function initMap() {
    ko.applyBindings(new viewModel());
}
var sites = [{ //Array of Sites 
        name: 'Swaminarayan Akshardham Temple',
        location: {
            lat: 28.6128672,
            lng: 77.2778449
        },
        locId: "4b86304df964a5202d8231e3",
        description: "Swaminarayan Akshardham Temple is a Hindu temple, and a spiritual-cultural campus in Delhi, India which attracts approximately 70 percent of all tourists who visit Delhi, was officially opened on 6 November 2005 by Former President Of India Dr. A. P. J. Abdul Kalam.",
        list: true
    },
    {
        name: 'Red Fort',
        location: {
            lat: 28.6561592,
            lng: 77.2388316
        },
        locId: "4bf214b83506ef3b1d7abd22",
        description: "Red Fort is a historic fort in the city of Delhi in India. It was the main residence of the emperors of the Mughal dynasty for nearly 200 years, until 1856. It is located in the center of Delhi and houses a number of museums. In addition to accommodating the emperors and their households, it was the ceremonial and political center of the Mughal state and the setting for events critically impacting the region.Every year on the Independence day of India (15 August), the Prime Minister hoists the Indian tricolour flag at the main gate of the fort and delivers a nationally broadcast speech from its ramparts.",
        list: true
    },
    {
        name: 'India Gate',
        location: {
            lat: 28.612912,
            lng: 77.227321
        },
        locId: "4b5eeab3f964a520ca9d29e3",
        description: "The India Gate is a war memorial located astride the Rajpath, on the eastern edge of the ceremonial axis of New Delhi, India, formerly called Kingsway.This structure, called Amar Jawan Jyoti, or the Flame of the Immortal Soldier, since 1971 has served as India's Tomb of the Unknown Soldier. India Gate is counted among the largest war memorials in India.",
        list: true
    },
    {
        name: 'Rashtrapati Bhawan',
        location: {
            lat: 28.6143478,
            lng: 77.1972413
        },
        locId: "4d57c17fafe4b60c84784861",
        description: "The Rashtrapati Bhavan is the official home of the President of India located at the Western end of Rajpath in New Delhi, India. Rashtrapati Bhavan may refer to only the 340-room main building that has the president's official residence, including reception halls, guest rooms and offices, also called the mansion; it may also refer to the entire 130-hectare (320 acre) Presidential Estate that additionally includes huge presidential gardens (Mughal Gardens), large open spaces, residences of bodyguards and staff, stables, other offices and utilities within its perimeter walls. In terms of area, it is one of the largest residences of a head of state in the world.",
        list: true
    },
    {
        name: 'Parliament House',
        location: {
            lat: 28.6172144,
            lng: 77.2059384
        },
        locId: "4e19ef7a814da5f552571039",
        description: "The Sansad Bhawan (Parliament Building) is the house of the Parliament of India, located in New Delhi.The Parliament of India is the supreme legislative body of the Republic of India. The Parliament is composed of the President of India and the houses. It is a bicameral legislature with two houses: the Rajya Sabha (Council of States) and the Lok Sabha (House of the People).",
        list: true
    },
    {
        name: 'Cannaught Place',
        location: { 
            lat: 28.6289143,
            lng: 77.2065322
        },
        locId: "53b314b6498e1eac65eb7853",
        description: "Connaught Place is one of the largest financial, commercial and business centres in New Delhi, India. It is often abbreviated as CP and houses the headquarters of several noted Indian firms. The main commercial area of the new city, New Delhi, occupies a place of pride in the city and are counted among the top heritage structures in New Delhi",
        list: true
    },

    {
        name: 'Select Citywalk Mall',
        location: {
            lat: 28.528843,
            lng: 77.2168209
        },
        locId: "4b68f120f964a5201b942be3",
        description: "Select CITYWALK is a shopping centre located in the Saket District Centre, in Saket, New Delhi. The 1,300,000 sq ft (120,000 m2) retail development is spread over 6 acres (24,000 m2) and includes a 4 km long multiplex, serviced apartments, offices and public spaces.",
        list: true
    }
];

function fourSquareData(marker, infoWindow) {
    var locId = marker.locId;
    $.ajax({
        url: "https://api.foursquare.com/v2/venues/" + locId + "?client_id=SIWTXR2ROKG1VWNJUUUPJUPSZ5F5ZL0FEZC5DELCCWO0IDD4&client_secret=HSD3MUFUWVGLSOEEJOQD1HZRPFOV3BCNFOIIHNOGJGY00AVW&v=20161016",
        dataType: 'json',
        success: function(data) {
            ven = data.response.venue;
            marker.likes = ven.likes.summary;
            marker.address = "";
            for (var i = 0; i < ven.location.formattedAddress.length; i++) {
                marker.address += ven.location.formattedAddress[i];
                marker.address += "<br>";
            }
            infoWindow.setContent('<div>' + marker.name + '<br>' + marker.description + '</div>' + marker.address + marker.likes);
        },
        error: function(data) {
            infoWindow.setContent('<div>' + marker.name + '<br>' + marker.description + '</div>' + 'Unable to get fourSquare data')
        }
    });
}

function populateInfo(marker, infoWindow) {
    if (infoWindow.marker != marker) { //ensures that only 1 infowindow is opened per marker
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.name + '<br>' + marker.description + '</div>');
        fourSquareData(marker, infoWindow);
        infoWindow.open(map, marker);

        infoWindow.addListener('closeclick', function() {
            infoWindow.setMarker(null);
        });
    }
}

function markerListener() { //Animations on click
    var currentMarker = this;
    populateInfo(this, infoWindow); //
    currentMarker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        currentMarker.setAnimation(null);
    }, 1000);
}

var viewModel = function() {
    map = new google.maps.Map(document.getElementById('map'), { //map created and initial coords and zoom is set
        center: {
            lat: 30.726388,
            lng: 76.768300
        },
        zoom: 15
    });
    var self = this;
    self.markerArray = []; //array of markers
    infoWindow = new google.maps.InfoWindow(); //used to generate info windows
    var boundaries = new google.maps.LatLngBounds(); //used to set boundaries
    for (var i = 0; i < sites.length; i++) { //used to push the contents of array site to markerArray
        var positions = sites[i].location;
        var name = sites[i].name;
        var locId = sites[i].locId;
        var description = sites[i].description;
        var lists = sites[i].list;
        var marker = new google.maps.Marker({ //used to create markers
            map: map,
            position: positions,
            name: name,
            animation: google.maps.Animation.DROP,
            description: description,
            locId: locId,
            list: ko.observable(lists)
        });
        marker.addListener('click', markerListener);
        self.markerArray.push(marker); //Pushes various markers to an array
        boundaries.extend(marker.position); //verify boundaries

    }
    self.filteredLocation = ko.observable(""); // used to store value from list so as to filter
    /*Search or Filter Algorithm taken reference from stackoverflow*/
    self.test = function(viewModel, event) {
        if (self.filteredLocation().length === 0) {
            for (var i = 0; i < self.markerArray.length; i++) {
                self.markerArray[i].setVisible(true);
                self.markerArray[i].list(true);
            }
        } else {
            for (var k = 0; k < self.markerArray.length; k++) {
                if (self.markerArray[k].name.toLowerCase().indexOf(self.filteredLocation().toLowerCase()) >= 0) {
                    self.markerArray[k].setVisible(true);
                    self.markerArray[k].list(true);
                } else {
                    self.markerArray[k].setVisible(false);
                    self.markerArray[k].list(false);
                }
            }
        }
        infoWindow.close();
    };
    map.fitBounds(boundaries);
};