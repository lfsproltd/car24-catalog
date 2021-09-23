
import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";

import { useDispatch } from "react-redux";
import { config } from './../../utils/constants/api.constants';

const MyGoogleMap = () => {
    const dispatch = useDispatch();
    const [address, setAddress] = React.useState("");
    const [coordinates, setCoordinates] = React.useState({
        lat: null,
        lng: null
    });
    {
        console.log(config.api.google.googleKey)
    }
    ///need to write this function in some another file
    

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        console.log(latLng)
        setAddress(value);

        setCoordinates(latLng);
    };

    return (
        <div>
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        {/* <p>Latitude: {coordinates.lat}</p>
                        <p>Longitude: {coordinates.lng}</p> */}
                        {console.log(suggestions)}
                        <input {...getInputProps({ placeholder: "Type address" })} class ="form-control" />

                        <div>
                            {loading ? <div>...loading</div> : null}
                            {console.log(suggestions)}
                            {suggestions.map(suggestion => {
                                const style = {
                                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                                };

                                return (
                                    <div {...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        </div>
    );
}
 export default MyGoogleMap;
// import React from 'react';
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-places-autocomplete';
// import { useDispatch } from "react-redux";
//  import { config } from './../../utils/constants/api.constants';
 
// class MyGoogleMap extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { address: '' };
//   }
 
//   handleChange = address => {
//       console.log(address)
//     this.setState({ address });
//   };
 
//   handleSelect = address => {
//     geocodeByAddress(address)
//       .then(results => getLatLng(results[0]) )
//       .then(latLng => console.log('Success', latLng))
//       .catch(error => console.error('Error', error));
//   };
 
//   render() {
//     return (
//       <PlacesAutocomplete
//         value={this.state.address}
//         onChange={this.handleChange}
//         onSelect={this.handleSelect}
//       >
//         {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//           <div>
//             <input
//               {...getInputProps({
//                 placeholder: 'Search Places ...',
//                 className: 'location-search-input',
//               })}
//             />
//             <div className="autocomplete-dropdown-container">
//               {loading && <div>Loading...</div>}
//               {suggestions.map(suggestion => {
//                 const className = suggestion.active
//                   ? 'suggestion-item--active'
//                   : 'suggestion-item';
//                 // inline style for demonstration purpose
//                 const style = suggestion.active
//                   ? { backgroundColor: '#fafafa', cursor: 'pointer' }
//                   : { backgroundColor: '#ffffff', cursor: 'pointer' };
//                 return (
//                   <div
//                     {...getSuggestionItemProps(suggestion, {
//                       className,
//                       style,
//                     })}
//                   >
//                     <span>{suggestion.description}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </PlacesAutocomplete>
//     );
//   }
// }
// export default MyGoogleMap;
