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


// import React, { Component } from 'react';
// import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
// import { Constants, Permissions, Contacts } from 'expo';

// export default class App extends Component {
  
//   render() {
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity onPress={this.showFirstContactAsync}>
//           <Text style={styles.paragraph}>
//             Get first contact by ID!
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }


  
//   showFirstContactAsync = async () => {
//     // Ask for permission to query contacts.
//     const permission = await Permissions.askAsync(Permissions.CONTACTS);
//     if (permission.status !== 'granted') {
//       console.log("Permission denied!")
//       return;
//     }
//     const contacts = await Contacts.getContactsAsync({
//       // fields: [
//       //   Contacts.PHONE_NUMBERS,
//       //   Contacts.EMAILS,
//       // ],
//       pageSize: 0,
//       pageOffset: 0,
//     });
    
//     console.log(contacts)

//     // if (contacts.total > 0) {
//     //   var firstId = contacts.data[0].id;
//     // }
    
//     // const contactById = await Contacts.getContactByIdAsync({
//     //   fields: [
//     //     Contacts.PHONE_NUMBERS,
//     //     Contacts.EMAILS,
//     //   ],
//     //   id: firstId,
//     // });
//     // console.log("Fetched contact by id:" + JSON.stringify(contactById))
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     padding: 15,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#34495e',
//     backgroundColor: '#ccccff',
//   },
// });


import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button, FlatList, StatusBar, Platform } from 'react-native';
import { Contacts, Constants, Permissions, Updates } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

export default class App extends React.Component {
  state = {
    error: null,
    contacts: null,
    contactFetchedById: null,
  };

  componentDidMount() {
    if (Platform.OS !== "android") {
      console.error("The bug described occurs only on Android!");
    }
    StatusBar.setBarStyle("dark-content");
    this._loadContacts();
  }

  _loadContacts = async () => {
    try {
      await Permissions.askAsync(Permissions.CONTACTS);
      const { data: contacts } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] })
      let contactFetchedById;
      if (contacts.length > 0) {
        contactFetchedById = await Contacts.getContactByIdAsync(contacts[0].id, [Contacts.Fields.PhoneNumbers]);
      }
      
      this.setState({ contacts, contactFetchedById: contactFetchedById });
    } catch (error) {
      this.setState({ error });
    }
  }

  _keyExtractor = ({ id }) => id;

  _reload = () => Updates.reload();

  _renderHeader = (header) => (
    <View style={styles.flatListHeaderWrapper}>
      <Text style={styles.flatListHeader}>{header}</Text>
    </View>
  )

  _renderContact = ({ item: { firstName, lastName, name, phoneNumbers } }) => (
    <View style={styles.contact}>
      <Text style={styles.contactName}>{name || [firstName, lastName].join(" ")}</Text>
      <Text style={styles.phoneNumbers}>📞 {phoneNumbers ? phoneNumbers.map(entry => entry.number).join(", ") : "undefined"}</Text>
    </View>
  )

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Error occurred</Text>
          <Text style={styles.errorMessage}>{this.state.error.message}</Text>
          <Button title="Reload" onPress={this._reload} />
        </View>
      );
    } else if (!this.state.contacts) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading contacts…</Text>
        </View>
      )
    }

    const flatListHeader = this._renderHeader("Contacts.getContactsAsync");

    const contactFetchedByIdHeader = this.state.contactFetchedById ? (
      <View style={styles.contactByIdWrapper}>
        {this._renderHeader("Contacts.getContactByIdAsync")}
        {this._renderContact({ item: this.state.contactFetchedById })}
      </View>
    ) : null;

    return (
        <View style={styles.container}>
          {contactFetchedByIdHeader}
          <FlatList
            alwaysBounceVertical
            style={styles.flatList}
            data={this.state.contacts}
            renderItem={this._renderContact}
            keyExtractor={this._keyExtractor}
            ListHeaderComponent={flatListHeader}
          />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  errorText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: "center",
  },
  errorMessage: {
    paddingVertical: 8,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 6,
  },
  flatList: {
    borderTopWidth: 1,
    borderTopColor: "#E6E6EC"
  },
  flatListHeader: {
    fontWeight: "bold",
    color: "white",
  },
  flatListHeaderWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#3527E5",
  },
  contact: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6EC"
  },
  contactName: {
    color: "#3527E5",
    fontWeight: "bold"
  },
  contactByIdWrapper: {
    backgroundColor: "#E6E6EC"
  },
});
