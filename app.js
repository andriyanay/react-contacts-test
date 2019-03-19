// import React from 'react';
// import { Platform, StatusBar, StyleSheet, View } from 'react-native';
// import { AppLoading, Asset, Font, Icon } from 'expo';
// import AppNavigator from './navigation/AppNavigator';

// export default class App extends React.Component {
//   state = {
//     isLoadingComplete: false,
//   };

//   render() {
//     if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
//       return (
//         <AppLoading
//           startAsync={this._loadResourcesAsync}
//           onError={this._handleLoadingError}
//           onFinish={this._handleFinishLoading}
//         />
//       );
//     } else {
//       return (
//         <View style={styles.container}>
//           {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
//           <AppNavigator />
//         </View>
//       );
//     }
//   }

//   _loadResourcesAsync = async () => {
//     return Promise.all([
//       Asset.loadAsync([
//         require('./assets/images/robot-dev.png'),
//         require('./assets/images/robot-prod.png'),
//       ]),
//       Font.loadAsync({
//         // This is the font that we are using for our tab bar
//         ...Icon.Ionicons.font,
//         // We include SpaceMono because we use it in HomeScreen.js. Feel free
//         // to remove this if you are not using it in your app
//         'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
//       }),
//     ]);
//   };

//   _handleLoadingError = error => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   _handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });


import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Constants, Permissions, Contacts } from 'expo';

export default class App extends Component {
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.showFirstContactAsync}>
          <Text style={styles.paragraph}>
            Get first contact by ID!
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  
  showFirstContactAsync = async () => {
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      console.log("Permission denied!")
      return;
    }
    const contacts = await Contacts.getContactsAsync({
      // fields: [
      //   Contacts.PHONE_NUMBERS,
      //   Contacts.EMAILS,
      // ],
      pageSize: 0,
      pageOffset: 0,
    });
    
    console.log(contacts)

    // if (contacts.total > 0) {
    //   var firstId = contacts.data[0].id;
    // }
    
    // const contactById = await Contacts.getContactByIdAsync({
    //   fields: [
    //     Contacts.PHONE_NUMBERS,
    //     Contacts.EMAILS,
    //   ],
    //   id: firstId,
    // });
    // console.log("Fetched contact by id:" + JSON.stringify(contactById))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    padding: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
    backgroundColor: '#ccccff',
  },
});