import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

// Create navigators
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitle: null }}>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerTitle: null, headerShown:false }} // Hides title
      />
      <Stack.Screen 
        name="Learn" 
        component={LearnScreen} 
        options={{ headerTitle: null, headerShown:false }} // Hides title
      />
    </Stack.Navigator>
  );
}

// Home Screen
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.appName}>RecycleBuddy</Text>
          <Text style={styles.tagline}>AI-Powered Recycling Assistant</Text>
        </View>
        
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Recycle Smarter</Text>
            <Text style={styles.heroSubtitle}>Scan, Learn, Dispose Responsibly</Text>
            <TouchableOpacity 
              style={styles.heroCTA} 
              onPress={() => navigation.navigate('Scan')}
            >
              <Text style={styles.heroButtonText}>Start Scanning</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <TouchableOpacity 
            style={styles.featureCard} 
            onPress={() => navigation.navigate('Scan')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#e6f7ff' }]}>
              <Feather name="camera" size={20} color="black" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Identification</Text>
              <Text style={styles.featureDescription}>Scan waste items to identify recyclability</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#0099cc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Guide')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#e6ffe6' }]}>
              <Feather name="info" size={24} color="#00cc66" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Disposal Guidance</Text>
              <Text style={styles.featureDescription}>Learn how to properly dispose of waste</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#00cc66" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Learn')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#fff2e6' }]}>
              <Feather name="book-open" size={24} color="black" />  
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sustainability Education</Text>
              <Text style={styles.featureDescription}>Educational resources on environmental impact</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#ff9933" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#f2e6ff' }]}>
              <Feather name="map-pin" size={24} color="#9933ff" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Recycling Locations</Text>
              <Text style={styles.featureDescription}>Find nearby recycling bins and centers</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#9933ff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.impactContainer}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          
          <View style={styles.impactCard}>
            <View style={styles.impactIconContainer}>
              <Feather name="trash-2" size={32} color="#fff" />
            </View>
            <Text style={styles.impactTitle}>Waste Reduction</Text>
            <Text style={styles.impactDescription}>
              Proper recycling reduces landfill waste and pollution
            </Text>
          </View>
          
          <View style={styles.impactCard}>
            <View style={[styles.impactIconContainer, {backgroundColor: '#4CAF50'}]}>
              <Feather name="refresh-cw" size={32} color="#fff" />
            </View>
            <Text style={styles.impactTitle}>Resource Conservation</Text>
            <Text style={styles.impactDescription}>
              Recycling conserves natural resources and reduces energy consumption
            </Text>
          </View>
          
          <View style={styles.impactCard}>
            <View style={[styles.impactIconContainer, {backgroundColor: '#2196F3'}]}>
              <Entypo name="leaf" size={32} color="#fff" />
            </View>
            <Text style={styles.impactTitle}>Ecosystem Protection</Text>
            <Text style={styles.impactDescription}>
              Proper waste management protects wildlife and natural habitats
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Scan Screen
const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [result, setResult] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setCameraActive(true);
      return () => setCameraActive(false);
    }, [])
  );

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        setScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true
        });
        setCapturedImage(photo);
        await analyzeImage(photo);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to take picture.');
        setScanning(false);
      }
    } else {
      Alert.alert('Camera not ready');
    }
  };
  
  const analyzeImage = async (photo) => {
    try {
      // For demo purposes, we'll simulate an API response
      // In a real app, you would send the image to your backend
      setTimeout(() => {
        const mockResults = [
          {
            item: "Plastic Bottle",
            materialType: "PET (Type 1)",
            isRecyclable: true,
            disposalInstructions: "Rinse, remove cap, and place in recycling bin. Caps can be recycled separately.",
            environmentImpact: "Recycling 1 ton of plastic bottles saves 3.8 barrels of oil."
          },
          {
            item: "Cardboard Box",
            materialType: "Corrugated Cardboard",
            isRecyclable: true,
            disposalInstructions: "Flatten and remove any tape or labels before recycling.",
            environmentImpact: "Recycling 1 ton of cardboard saves 17 trees and 7,000 gallons of water."
          }
        ];
        
        setResult(mockResults);
        setScanning(false);
      }, 2000);
    } catch (err) {
      console.error("[analyzeImage] Error:", err);
      Alert.alert('Failed', 'Error analyzing image');
      setScanning(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scanContainer}>
        {!result ? (
          <>
            <View style={styles.cameraContainer}>
              {cameraActive ? (
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing="back"
                  onCameraReady={() => setCameraReady(true)}
                />
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Feather name="camera" size={48} color="#fff" />
                  <Text style={styles.cameraText}>Loading camera...</Text>
                </View>
              )}
              {scanning && (
                <View style={styles.overlay}>
                  <Feather name="loader" size={24} color="white" />
                  <Text style={styles.overlayText}>Analyzing...</Text>
                </View>
              )}
              {capturedImage && !scanning && (
                <Image 
                  source={{ uri: capturedImage.uri }}
                  style={styles.capturedImage}
                />
              )}
            </View>

            <View style={styles.scanInstructions}>
              <Text style={styles.scanTitle}>Smart Waste Identification</Text>
              <Text style={styles.scanDescription}>
                Our AI will analyze your waste item and provide recycling guidance.
              </Text>

              <TouchableOpacity
                style={styles.scanButton}
                onPress={takePicture}
                disabled={scanning || !cameraReady}
              >
                <Text style={styles.scanButtonText}>
                  {scanning ? 'Analyzing...' : 'Capture & Analyze'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.scanTip}>
                Tip: Make sure the item is well-lit and centered in the frame.
              </Text>
            </View>
          </>
        ) : (
          <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Scan Result</Text>
              <TouchableOpacity onPress={resetScan}>
                <Text style={styles.resetButton}>New Scan</Text>
              </TouchableOpacity>
            </View>

            {capturedImage && (
              <View style={styles.resultImageContainer}>
                <Image
                  source={{ uri: capturedImage.uri }}
                  style={styles.resultImage}  
                />
              </View>
            )}
            
            {result.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <Text style={styles.itemName}>{item.item}</Text>
                <Text style={styles.itemType}>{item.materialType}</Text>

                <View style={[
                  styles.recyclableTag,
                  { backgroundColor: item.isRecyclable ? '#e6ffe6' : '#ffe6e6' }
                ]}>
                  <Text style={[
                    styles.recyclableText,
                    { color: item.isRecyclable ? '#00cc66' : '#ff3333' }
                  ]}>
                    {item.isRecyclable ? 'Recyclable' : 'Not Recyclable'}
                  </Text>
                </View>

                <View style={styles.instructionsCard}>
                  <Text style={styles.instructionsTitle}>Disposal Instructions</Text>
                  <Text style={styles.instructionsText}>{item.disposalInstructions}</Text>
                </View>

                <View style={styles.impactInfo}>
                  <Text style={styles.impactInfoTitle}>Environmental Impact</Text>
                  <Text style={styles.impactInfoText}>{item.environmentImpact}</Text>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.requestPickupButton}
              onPress={() => navigation.navigate('PickupRequest', { scannedItems: result })}
            >
              <Text style={styles.requestPickupText}>Request Pickup</Text>
              <Feather name="truck" size={18} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

// Guide Screen
const GuideScreen = () => {
  const categories = [
    {
      id: 1,
      name: 'Plastics',
      icon: 'bottle',
      color: '#2196F3',
      types: [
        { type: 'PET (1)', recyclable: true, examples: 'Water bottles, soda bottles' },
        { type: 'HDPE (2)', recyclable: true, examples: 'Milk jugs, detergent bottles' },
        { type: 'PVC (3)', recyclable: false, examples: 'Pipes, window frames' },
        { type: 'LDPE (4)', recyclable: 'Sometimes', examples: 'Plastic bags, squeeze bottles' },
        { type: 'PP (5)', recyclable: true, examples: 'Yogurt containers, bottle caps' },
        { type: 'PS (6)', recyclable: 'Sometimes', examples: 'Styrofoam, disposable cups' },
        { type: 'Other (7)', recyclable: false, examples: 'Mixed plastics' },
      ]
    },
    {
      id: 2,
      name: 'Paper',
      icon: 'paper',
      color: '#4CAF50',
      types: [
        { type: 'Newspaper', recyclable: true, examples: 'Newspapers, flyers' },
        { type: 'Cardboard', recyclable: true, examples: 'Boxes, packaging' },
        { type: 'Mixed Paper', recyclable: true, examples: 'Office paper, magazines' },
        { type: 'Shredded Paper', recyclable: 'Sometimes', examples: 'Shredded documents' },
        { type: 'Waxed Paper', recyclable: false, examples: 'Waxed food containers' },
      ]
    },
    {
      id: 3,
      name: 'Glass',
      icon: 'glass',
      color: '#9C27B0',
      types: [
        { type: 'Clear Glass', recyclable: true, examples: 'Jars, bottles' },
        { type: 'Colored Glass', recyclable: true, examples: 'Wine bottles, beer bottles' },
        { type: 'Window Glass', recyclable: false, examples: 'Windows, mirrors' },
        { type: 'Drinking Glasses', recyclable: false, examples: 'Cups, tumblers' },
        { type: 'Light Bulbs', recyclable: 'Special', examples: 'Incandescent, LED, CFL' },
      ]
    },
    {
      id: 4,
      name: 'Metal',
      icon: 'metal',
      color: '#FF9800',
      types: [
        { type: 'Aluminum', recyclable: true, examples: 'Cans, foil' },
        { type: 'Steel', recyclable: true, examples: 'Food cans, aerosol cans' },
        { type: 'Scrap Metal', recyclable: true, examples: 'Pipes, tools' },
        { type: 'Electronics', recyclable: 'Special', examples: 'Computers, phones' },
        { type: 'Batteries', recyclable: 'Special', examples: 'AA, AAA, lithium' },
      ]
    },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.guideContainer}>
        <Text style={styles.guideTitle}>Recycling Guide</Text>
        <Text style={styles.guideSubtitle}>Learn how to properly dispose of different materials</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory.id === category.id && styles.categoryTabActive,
                {borderColor: category.color}
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryTabText,
                  selectedCategory.id === category.id && {color: category.color}
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.categoryContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.categoryHeader, {backgroundColor: selectedCategory.color}]}>
            <Text style={styles.categoryHeaderText}>{selectedCategory.name} Recycling Guide</Text>
          </View>
          {selectedCategory.types.map((item, index) => (
            <View key={index} style={styles.materialItem}>
              <View style={styles.materialHeader}>
                <Text style={styles.materialType}>{item.type}</Text>
                <View style={[
                  styles.recyclableIndicator,
                  {
                    backgroundColor: 
                      item.recyclable === true ? '#e6ffe6' : 
                      item.recyclable === false ? '#ffe6e6' : '#fff2e6'
                  }
                ]}>
                  <Text style={[
                    styles.recyclableIndicatorText,
                    {
                      color: 
                        item.recyclable === true ? '#00cc66' : 
                        item.recyclable === false ? '#ff3333' : '#ff9933'
                    }
                  ]}>
                    {typeof item.recyclable === 'boolean' 
                      ? (item.recyclable ? 'Recyclable' : 'Not Recyclable') 
                      : item.recyclable}
                  </Text>
                </View>
              </View>
              <Text style={styles.materialExamples}>Examples: {item.examples}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Learn Screen
const LearnScreen = () => {
  const articles = [
    {
      id: 1,
      title: 'The Impact of Plastic Pollution',
      image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      preview: 'Plastic pollution has become one of the most pressing environmental issues...',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Recycling Myths Debunked',
      image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      preview: 'There are many misconceptions about recycling. Lets separate fact from fiction...',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'How to Start Composting at Home',
      image: 'https://images.unsplash.com/photo-1591913139841-5cb4e5ba7605?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      preview: 'Composting is a natural process that transforms kitchen and garden waste...',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Zero Waste Lifestyle: Getting Started',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      preview: 'The zero waste movement aims to reduce the amount of trash sent to landfills...',
      readTime: '7 min read'
    },
  ];
  
  const tips = [
    'Rinse containers before recycling to prevent contamination',
    'Remove caps from plastic bottles before recycling',
    'Flatten cardboard boxes to save space in recycling bins',
    'Don\'t bag recyclables - keep them loose in the bin',
    'Check local guidelines as recycling rules vary by location'
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.learnContainer}>
        <Text style={styles.learnTitle}>Sustainability Education</Text>
        <Text style={styles.learnSubtitle}>Learn about environmental sustainability and best practices</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8M</Text>
            <Text style={styles.statLabel}>Tons of plastic enter our oceans each year</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>69%</Text>
            <Text style={styles.statLabel}>Of India's waste is recyclable</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8%</Text>
            <Text style={styles.statLabel}>Is actually recycled</Text>
          </View>
        </View>
        
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>Educational Articles</Text>
          
          {articles.map(article => (
            <TouchableOpacity key={article.id} style={styles.articleCard}>
              <Image source={{ uri: article.image }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articlePreview}>{article.preview}</Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  <Text style={styles.articleReadMore}>Read More</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Recycling Tips</Text>
          
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipBullet}>
                <Text style={styles.tipBulletText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Educational Videos</Text>
          
          <View style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>▶</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>How Recycling Works: Behind the Scenes</Text>
            <Text style={styles.videoDuration}>4:32</Text>
          </View>
          
          <View style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>▶</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>The Life Cycle of Plastic</Text>
            <Text style={styles.videoDuration}>5:47</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Map Screen
const MapScreen = () => {
  const [location, setLocation] = useState('Current Location');
  const [recyclingPoints, setRecyclingPoints] = useState([
    { id: 1, name: 'Community Recycling Center', distance: '0.8 mi', types: ['Plastic', 'Paper', 'Glass', 'Metal'] },
    { id: 2, name: 'Green Earth Recycling', distance: '1.2 mi', types: ['Plastic', 'Paper', 'Electronics'] },
    { id: 3, name: 'City Waste Management', distance: '2.5 mi', types: ['All Types', 'Hazardous Waste'] },
    { id: 4, name: 'EcoRecycle Drop-off', distance: '3.1 mi', types: ['Plastic', 'Glass', 'Metal'] },
    { id: 5, name: 'University Recycling Point', distance: '3.8 mi', types: ['Paper', 'Plastic', 'Batteries'] },
  ]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>Recycling Locations</Text>
          <View style={styles.locationSelector}>
            <Feather name="map-pin" size={16} color="#4CAF50" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        
        <View style={styles.mapView}>
          <Text style={styles.mapPlaceholder}>Map View</Text>
          <View style={styles.mapPin1}>
            <Feather name="map-pin" size={24} color="#4CAF50" />
          </View>
          <View style={styles.mapPin2}>
            <Feather name="map-pin" size={24} color="#4CAF50" />
          </View>
          <View style={styles.mapPin3}>
            <Feather name="map-pin" size={24} color="#4CAF50" />
          </View>
          <View style={styles.mapUserLocation}>
            <View style={styles.userLocationDot} />
          </View>
        </View>
        
        <View style={styles.locationsList}>
          <Text style={styles.locationsTitle}>Nearby Recycling Points</Text>
          <ScrollView showsVerticalScrollIndicator={false}>          
            {recyclingPoints.map(point => (
              <TouchableOpacity key={point.id} style={styles.locationCard}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{point.name}</Text>
                  <Text style={styles.locationDistance}>{point.distance}</Text>
                </View>
                <View style={styles.locationTypes}>
                  {point.types.map((type, index) => (
                    <View key={index} style={styles.typeTag}>
                      <Text style={styles.typeTagText}>{type}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.locationActions}>
                  <TouchableOpacity style={styles.directionButton}>
                    <Text style={styles.directionButtonText}>Directions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.infoButton}>
                    <Text style={styles.infoButtonText}>More Info</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Pickup Request Screen
const PickupRequestScreen = ({ route, navigation }) => {
  const { scannedItems } = route.params || { scannedItems: [] };
  
  const [address, setAddress] = useState('');
  const [items, setItems] = useState(
    scannedItems.map(item => ({
      name: item.item,
      type: item.materialType,
      quantity: 1
    }))
  );
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Get user's current location on component mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to pre-fill your address');
          return;
        }

        setLoading(true);
        const location = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (geocode.length > 0) {
          const loc = geocode[0];
          setAddress(`${loc.street || ''}, ${loc.city || ''}, ${loc.region || ''}, ${loc.postalCode || ''}`);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not determine your location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };

  const updateItemQuantity = (index, value) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, parseInt(value) || 1);
    setItems(newItems);
  };

  const findVendors = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const nearbyVendors = [
          {
            id: '1',
            name: 'Green Recyclers',
            rating: 4.8,
            fee: '$5.99',
            nextSlot: '2 hours',
            distance: '1.2 miles'
          },
          {
            id: '2',
            name: 'EcoWaste Solutions',
            rating: 4.5,
            fee: '$4.50',
            nextSlot: 'Tomorrow',
            distance: '2.4 miles'
          },
          {
            id: '3',
            name: 'City Recycling Co.',
            rating: 4.2,
            fee: '$7.99',
            nextSlot: 'Today, 5PM',
            distance: '0.8 miles'
          },
          {
            id: '4',
            name: 'RecycleNow',
            rating: 4.7,
            fee: '$6.50',
            nextSlot: 'Today, 3PM',
            distance: '3.1 miles'
          }
        ];
        
        setVendors(nearbyVendors);
        setShowVendorModal(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error finding vendors:', error);
      Alert.alert('Error', 'Failed to find vendors. Please try again.');
      setLoading(false);
    }
  };

  const confirmPickup = async () => {
    if (!selectedVendor) {
      Alert.alert('Error', 'Please select a vendor first');
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful response
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success!',
          `Your pickup has been scheduled with ${selectedVendor.name} for ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          [
            { 
              text: 'View My Pickups', 
              onPress: () => navigation.navigate('MyPickups') 
            },
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1500);
    } catch (error) {
      console.error('Error requesting pickup:', error);
      Alert.alert('Error', 'Failed to schedule pickup. Please try again.');
      setLoading(false);
    }
  };

  const renderVendorItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.vendorItem, 
        selectedVendor?.id === item.id && styles.selectedVendor
      ]}
      onPress={() => setSelectedVendor(item)}
    >
      <View style={styles.vendorHeader}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.vendorDetails}>
        <View style={styles.vendorDetail}>
          <Feather name="clock" size={14} color="#666" />
          <Text style={styles.vendorDetailText}>Next: {item.nextSlot}</Text>
        </View>
        
        <View style={styles.vendorDetail}>
          <Feather name="map-pin" size={14} color="#666" />
          <Text style={styles.vendorDetailText}>{item.distance}</Text>
        </View>
        
        <View style={styles.vendorDetail}>
          <Feather name="dollar-sign" size={14} color="#666" />
          <Text style={styles.vendorDetailText}>Fee: {item.fee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request Pickup</Text>
        <Text style={styles.subtitle}>Schedule a pickup for your recyclable items</Text>
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Pickup Address</Text>
        <TextInput
          style={styles.addressInput}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          multiline
        />
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Items for Pickup</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemType}>{item.type}</Text>
            </View>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateItemQuantity(index, item.quantity - 1)}
              >
                <Feather name="minus" size={16} color="#4CAF50" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.quantityInput}
                value={item.quantity.toString()}
                onChangeText={(value) => updateItemQuantity(index, value)}
                keyboardType="number-pad"
              />
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateItemQuantity(index, item.quantity + 1)}
              >
                <Feather name="plus" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addItemButton}>
          <Feather name="plus" size={16} color="#4CAF50" />
          <Text style={styles.addItemText}>Add More Items</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Pickup Date & Time</Text>
        
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity 
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={16} color="#4CAF50" />
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Feather name="clock" size={16} color="#4CAF50" />
            <Text style={styles.dateTimeText}>
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.findVendorsButton}
        onPress={findVendors}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text style={styles.findVendorsText}>Find Available Vendors</Text>
            <Feather name="search" size={16} color="#fff" />
          </>
        )}
      </TouchableOpacity>
      
      {selectedVendor && (
        <View style={styles.selectedVendorContainer}>
          <Text style={styles.selectedVendorTitle}>Selected Vendor</Text>
          <View style={styles.selectedVendorCard}>
            <Text style={styles.selectedVendorName}>{selectedVendor.name}</Text>
            <View style={styles.selectedVendorDetails}>
              <View style={styles.vendorDetail}>
                <Feather name="star" size={14} color="#FFD700" />
                <Text style={styles.vendorDetailText}>{selectedVendor.rating}</Text>
              </View>
              <View style={styles.vendorDetail}>
                <Feather name="dollar-sign" size={14} color="#666" />
                <Text style={styles.vendorDetailText}>Fee: {selectedVendor.fee}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={confirmPickup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm Pickup</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Vendor Selection Modal */}
      <Modal
        visible={showVendorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVendorModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vendor</Text>
              <TouchableOpacity onPress={() => setShowVendorModal(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={vendors}
              renderItem={renderVendorItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.vendorList}
            />
            
            <TouchableOpacity 
              style={styles.selectVendorButton}
              onPress={() => {
                if (selectedVendor) {
                  setShowVendorModal(false);
                } else {
                  Alert.alert('Error', 'Please select a vendor');
                }
              }}
            >
              <Text style={styles.selectVendorText}>Select Vendor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// My Pickups Screen
const MyPickupsScreen = ({ navigation }) => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const userPickups = [
          {
            id: '1',
            date: '2025-05-05T14:30:00Z',
            status: 'Pending',
            address: '123 Main St, Anytown, CA 12345',
            items: [
              { name: 'Plastic Bottle', type: 'PET', quantity: 5 },
              { name: 'Cardboard Box', type: 'Paper', quantity: 2 }
            ],
            vendor: {
              id: '1',
              name: 'Green Recyclers',
              phone: '(555) 123-4567',
              rating: 4.8
            },
            estimatedArrival: '2:30 PM - 3:30 PM'
          },
          {
            id: '2',
            date: '2025-05-03T10:00:00Z',
            status: 'Accepted',
            address: '456 Oak Ave, Somewhere, CA 54321',
            items: [
              { name: 'Glass Bottles', type: 'Glass', quantity: 3 },
              { name: 'Aluminum Cans', type: 'Metal', quantity: 10 }
            ],
            vendor: {
              id: '2',
              name: 'EcoWaste Solutions',
              phone: '(555) 987-6543',
              rating: 4.5
            },
            estimatedArrival: '10:00 AM - 11:00 AM',
            driverName: 'John Smith',
            driverPhone: '(555) 555-5555',
            driverLocation: '5 minutes away'
          },
          {
            id: '3',
            date: '2025-04-28T13:15:00Z',
            status: 'Completed',
            address: '789 Pine St, Nowhere, CA 67890',
            items: [
              { name: 'Newspaper', type: 'Paper', quantity: 1 },
              { name: 'Plastic Containers', type: 'HDPE', quantity: 4 }
            ],
            vendor: {
              id: '3',
              name: 'City Recycling Co.',
              phone: '(555) 246-8101',
              rating: 4.2
            },
            completedAt: '2025-04-28T13:45:00Z',
            recycledWeight: '3.2 kg',
            environmentalImpact: 'Saved 2.5 kg of CO2 emissions'
          }
        ];
        
        setPickups(userPickups);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching pickups:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA000';
      case 'Accepted':
        return '#2196F3';
      case 'In Progress':
        return '#9C27B0';
      case 'Completed':
        return '#4CAF50';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + 
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const showPickupDetails = (pickup) => {
    setSelectedPickup(pickup);
    setDetailsModalVisible(true);
  };

  const renderPickupItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.pickupCard}
      onPress={() => showPickupDetails(item)}
    >
      <View style={styles.pickupHeader}>
        <Text style={styles.pickupDate}>{formatDate(item.date)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.pickupDetails}>
        <View style={styles.detailRow}>
          <Feather name="map-pin" size={16} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Feather name="package" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Feather name="user" size={16} color="#666" />
          <Text style={styles.detailText}>{item.vendor.name}</Text>
        </View>
      </View>
      
      <View style={styles.pickupFooter}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Feather name="chevron-right" size={16} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pickups</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchPickups}
        >
          <Feather name="refresh-cw" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your pickups...</Text>
        </View>
      ) : pickups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No pickup requests yet</Text>
          <TouchableOpacity 
            style={styles.newRequestButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <Text style={styles.newRequestText}>Scan Items for Pickup</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pickups}
          renderItem={renderPickupItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.pickupsList}
        />
      )}
      
      {/* Pickup Details Modal */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        {selectedPickup && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pickup Details</Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <View style={[styles.statusBanner, { backgroundColor: getStatusColor(selectedPickup.status) }]}>
                  <Text style={styles.statusBannerText}>{selectedPickup.status}</Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Pickup Information</Text>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date & Time:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedPickup.date)}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Address:</Text>
                    <Text style={styles.detailValue}>{selectedPickup.address}</Text>
                  </View>
                  
                  {selectedPickup.estimatedArrival && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Estimated Arrival:</Text>
                      <Text style={styles.detailValue}>{selectedPickup.estimatedArrival}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Items</Text>
                  
                  {selectedPickup.items.map((item, index) => (
                    <View key={index} style={styles.itemDetail}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemType}>{item.type}</Text>
                      </View>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Vendor Information</Text>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedPickup.vendor.name}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Contact:</Text>
                    <Text style={styles.detailValue}>{selectedPickup.vendor.phone}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Rating:</Text>
                    <View style={styles.ratingContainer}>
                      <Feather name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{selectedPickup.vendor.rating}</Text>
                    </View>
                  </View>
                </View>
                
                {selectedPickup.status === 'Accepted' && selectedPickup.driverName && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Driver Information</Text>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Name:</Text>
                      <Text style={styles.detailValue}>{selectedPickup.driverName}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Contact:</Text>
                      <Text style={styles.detailValue}>{selectedPickup.driverPhone}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text style={styles.detailValue}>{selectedPickup.driverLocation}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.trackButton}>
                      <Feather name="map" size={16} color="#fff" />
                      <Text style={styles.trackButtonText}>Track Driver</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {selectedPickup.status === 'Completed' && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Completion Details</Text>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Completed At:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedPickup.completedAt)}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Recycled Weight:</Text>
                      <Text style={styles.detailValue}>{selectedPickup.recycledWeight}</Text>
                    </View>
                    
                    <View style={styles.impactCard}>
                      <Feather name="award" size={24} color="#4CAF50" />
                      <Text style={styles.impactText}>{selectedPickup.environmentalImpact}</Text>
                    </View>
                  </View>
                )}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                {selectedPickup.status === 'Pending' && (
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel Pickup</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setDetailsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

// Stack navigator for Scan flow
const ScanStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ScanMain" component={ScanScreen} />
    <Stack.Screen name="PickupRequest" component={PickupRequestScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Scan') {
            iconName = 'camera';
          } else if (route.name === 'Guide') {
            iconName = 'info';
          } else if (route.name === 'Learn') {
            iconName = 'book-open';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'MyPickups') {
            iconName = 'truck';
          }
          
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingVertical: 5,
          height: 60
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ 
          headerTitle: null, 
          headerBackTitleVisible: false 
        }} 
      />
      <Tab.Screen name="Scan" component={ScanStack} />
      <Tab.Screen name="Guide" component={GuideScreen} />
      {/* <Tab.Screen name="Learn" component={LearnScreen} /> */}
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="MyPickups" component={MyPickupsScreen} options={{ title: 'Pickups' }} />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  // Home Screen Styles
  header: {
    padding: 20,
    paddingTop: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  heroContainer: {
    position: 'relative',
    height: 200,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  impactContainer: {
    padding: 20,
    paddingTop: 0,
  },
  impactCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  impactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  impactDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Scan Screen Styles
  scanContainer: {
    flex: 1,
    padding: 20,
  },
  cameraContainer: {
    height: 300,
    backgroundColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  capturedImage: {
    ...StyleSheet.absoluteFillObject,
  },
  scanInstructions: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scanDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanTip: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  resultContainer: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultImageContainer: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  recyclableTag: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  recyclableText: {
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  impactInfo: {
    backgroundColor: '#e6f7ff',
    borderRadius: 15,
    padding: 20,
  },
  impactInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0099cc',
    marginBottom: 10,
  },
  impactInfoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  requestPickupButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  requestPickupText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  
  // Guide Screen Styles
  guideContainer: {
    flex: 1,
    padding: 20,
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  guideSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    height: 44,
  },
  categoryTabActive: {
    backgroundColor: '#fff',
  },
  categoryTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  categoryContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    padding: 15,
    backgroundColor: '#4CAF50',
  },
  categoryHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  materialItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  materialType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recyclableIndicator: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  recyclableIndicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  materialExamples: {
    fontSize: 14,
    color: '#666',
  },
  
  // Learn Screen Styles
  learnContainer: {
    flex: 1,
    padding: 20,
  },
  learnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  learnSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  articlesSection: {
    marginBottom: 30,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    height: 150,
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  articlePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#999',
  },
  articleReadMore: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipBullet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipBulletText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  videoSection: {
    marginBottom: 30,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoThumbnail: {
    height: 180,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    paddingBottom: 5,
  },
  videoDuration: {
    fontSize: 12,
    color: '#999',
    padding: 15,
    paddingTop: 5,
  },
  
  // Map Screen Styles
  mapContainer: {
    flex: 1,
    padding: 20,
  },
  mapHeader: {
    marginBottom: 15,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  mapView: {
    height: 250,
    backgroundColor: '#e6e6e6',
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  mapPin1: {
    position: 'absolute',
    top: '30%',
    left: '40%',
  },
  mapPin2: {
    position: 'absolute',
    top: '50%',
    right: '30%',
  },
  mapPin3: {
    position: 'absolute',
    bottom: '20%',
    left: '60%',
  },
  mapUserLocation: {
    position: 'absolute',
    top: '60%',
    left: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  locationsList: {
    flex: 1,
  },
  locationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationDistance: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  locationTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  typeTag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  typeTagText: {
    fontSize: 12,
    color: '#666',
  },
  locationActions: {
    flexDirection: 'row',
  },
  directionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  directionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  infoButtonText: {
    color: '#666',
  },
  
  // Pickup Request Screen Styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 60,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  addItemText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    flex: 0.48,
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  findVendorsButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findVendorsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  selectedVendorContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  selectedVendorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  selectedVendorCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedVendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  selectedVendorDetails: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  vendorList: {
    paddingBottom: 20,
  },
  vendorItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVendor: {
    borderColor: '#4CAF50',
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  vendorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vendorDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorDetailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  selectVendorButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  selectVendorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // My Pickups Screen Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  newRequestButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  newRequestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickupsList: {
    padding: 20,
  },
  pickupCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pickupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickupDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickupDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  pickupFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 5,
  },
  modalBody: {
    flex: 1,
  },
  statusBanner: {
    padding: 15,
    alignItems: 'center',
  },
  statusBannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  trackButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  impactText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4CAF50',
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;