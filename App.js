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
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';


// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Screen
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.appName}>EcoScan</Text>
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
              {/* <ArrowRight stroke="#fff" width={16} height={16} /> */}
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
            {/* <ArrowRight stroke="" width={20} height={20} /> */}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Guide')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#e6ffe6' }]}>
              <Feather name="info" size={24} color="#00cc66" />
              {/* <Info stroke="#00cc66" width={24} height={24} /> */}
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Disposal Guidance</Text>
              <Text style={styles.featureDescription}>Learn how to properly dispose of waste</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#00cc66" />
            {/* <ArrowRight stroke="" width={20} height={20} /> */}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Learn')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#fff2e6' }]}>
              <Feather name="book-open" size={24} color="black" />  
              {/* <BookOpen stroke="#ff9933" width={24} height={24} /> */}
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sustainability Education</Text>
              <Text style={styles.featureDescription}>Educational resources on environmental impact</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#ff9933" />
            {/* <ArrowRight stroke="#" width={20} height={20} /> */}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: '#f2e6ff' }]}>
              <Feather name="map-pin" size={24} color="#9933ff" />
              {/* <MapPin stroke="#9933ff" width={24} height={24} /> */}
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Recycling Locations</Text>
              <Text style={styles.featureDescription}>Find nearby recycling bins and centers</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#9933ff" />
            {/* <ArrowRight stroke="#" width={20} height={20} /> */}
          </TouchableOpacity>
        </View>
        
        <View style={styles.impactContainer}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          
          <View style={styles.impactCard}>
            <View style={styles.impactIconContainer}>
              <Feather name="trash-2" size={32} color="#fff" />
              {/* <Trash2 stroke="#fff" width={32} height={32} /> */}
            </View>
            <Text style={styles.impactTitle}>Waste Reduction</Text>
            <Text style={styles.impactDescription}>
              Proper recycling reduces landfill waste and pollution
            </Text>
          </View>
          
          <View style={styles.impactCard}>
            <View style={[styles.impactIconContainer, {backgroundColor: '#4CAF50'}]}>
              <Feather name="refresh-cw" size={32} color="#fff" />
              {/* <RefreshCw stroke="#fff" width={32} height={32} /> */}
            </View>
            <Text style={styles.impactTitle}>Resource Conservation</Text>
            <Text style={styles.impactDescription}>
              Recycling conserves natural resources and reduces energy consumption
            </Text>
          </View>
          
          <View style={styles.impactCard}>
            <View style={[styles.impactIconContainer, {backgroundColor: '#2196F3'}]}>
              <Entypo name="leaf" size={32} color="#fff" />
              {/* <Leaf stroke="#fff" width={32} height={32} /> */}
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
const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [captureNextFrame, setCaptureNextFrame] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(
    React.useCallback(() => {
      setCameraActive(true);
  
      return () => {
        setCameraActive(false);  // When screen goes away, deactivate camera
      };
    }, [])
  );

  const handleSnapshot = async (frame) => {
    if (captureNextFrame) {
      const fileUri = FileSystem.cacheDirectory + `photo_${Date.now()}.jpg`;

      await FileSystem.writeAsStringAsync(fileUri, frame, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPhotoUri(fileUri);
      setCaptureNextFrame(false);

      setScanning(true);

      setTimeout(() => {
        setScanning(false);
        setResult({
          item: 'Plastic Bottle',
          type: 'PET',
          recyclable: true,
          instructions: 'Rinse and recycle',
          impact: 'Saves 3.8 barrels of oil.'
        });
      }, 2000);
    }
  };

  const capturePhoto = () => {
    setCaptureNextFrame(true);
  };

  const resetScan = () => {
    setResult(null);
  };


  if (!permission) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return <View><Text>No access to camera. Please allow it in settings.</Text></View>;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scanContainer}>
        {!result ? (
          <>
            {cameraActive && (
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                enableSnapshot
                onSnapshotReady={({ base64 }) => handleSnapshot(base64)}
              >
                {scanning && (
                  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 24 }}>Analyzing...</Text>
                  </View>
                )}
              </CameraView>
            )}

            <View style={styles.scanInstructions}>
              <Text style={styles.scanTitle}>Smart Waste Identification</Text>
              <Text style={styles.scanDescription}>
                Our AI will analyze your waste item and provide recycling guidance.
              </Text>
              
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress={capturePhoto}
                disabled={scanning}
              >
                <Text style={styles.scanButtonText}>
                  {scanning ? 'Scanning...' : 'Start Scan'}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.scanTip}>
                Tip: Make sure the item is well-lit and centered in the frame.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Scan Result</Text>
              <TouchableOpacity onPress={resetScan}>
                <Text style={styles.resetButton}>New Scan</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{result.item}</Text>
              <Text style={styles.itemType}>{result.type}</Text>
              
              <View style={[
                styles.recyclableTag, 
                {backgroundColor: result.recyclable ? '#e6ffe6' : '#ffe6e6'}
              ]}>
                <Text style={[
                  styles.recyclableText, 
                  {color: result.recyclable ? '#00cc66' : '#ff3333'}
                ]}>
                  {result.recyclable ? 'Recyclable' : 'Not Recyclable'}
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>Disposal Instructions</Text>
              <Text style={styles.instructionsText}>{result.instructions}</Text>
            </View>
            
            <View style={styles.impactInfo}>
              <Text style={styles.impactInfoTitle}>Environmental Impact</Text>
              <Text style={styles.impactInfoText}>{result.impact}</Text>
            </View>
          </View>
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
        <View style={styles.categoryContent}>
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
        </View>
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
        </View>
      </View>
    </SafeAreaView>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          
          if (route.name === 'Home') {
            icon = <Feather name="home" size={size} color={color} />
          } else if (route.name === 'Scan') {
            icon = <Feather name="camera" size={size} color={color} />
          } else if (route.name === 'Guide') {
            icon = <Feather name="info" size={size} color={color} />
          } else if (route.name === 'Learn') {
            icon = <Feather name="book-open" size={size} color={color} />
          } else if (route.name === 'Map') {
            icon = <Feather name="compass" size={size} color={color} />
          }
          
          return icon;
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Guide" component={GuideScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
    flex:1,
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
});

export default App;