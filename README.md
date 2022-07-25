# EasyParking

## EasyParking is a web responsive application where users can browse and search through distritcts for Accessible Parking Spots and display them on a Google Map Socket.

## Description

After registering as a new user, the user is able to browse through the 23 Districts of Vienna for Accessible Parking Spots. If you click on one of the districts, all the streets that contain accessible parking spots will be displayed, and you can either scroll through or search with a search filter for particular streets. Since some of the districts contain hundreds of streets or adresses it its recommended to use the search function because it is way faster than scrolling through all of the streets/adresses. The streets will be displayed with streetname and number as a headline on a card. Below that you can see certain information like: **description, timerange, private or public spots**. Some of the adresses contain more information others just have the private or public information shown. The information come from an api provided by the city of Vienna, which contain all of the accessible parking spots of Vienna with coordinates and all the other information I mentioned before. I implented the provided data with the google Maps api und not only can you see the streets and adresses listed, you are also able to display them district by district as red Markers in the GoogleMaps Socket. Then there is one particular marker that has looks like a wheelchair parking sign, which is always set by default in the middle of the city, when you open or refresh the page. Every adress listed next to google Map has a **Show on Map** button to click. If you click it, the Custom Marker will change its location to the exact Position where its located on the Map. If you now want to see further information, you can use the Google Street View function, to see the parking spot in real life, which is very helpful, because some spots may not be accessible enough. You can now see that already through street view. If you still search for more information or you would like to leave a review, there is a arrow button on every card, that leads you to a pop up window, where you can see review from other people, or write an own review, which can be very helpful for you or for others. Finally theres still the possibility to save some of the streets in favorites, and you will then be able to see them again lsited in your profile page. In your profile page you will also see a map socket again. If you didnt add anything to your favorites, the map will only show the city of vienna, and if you have some favorites added it shows the marker of your favorites again on the map. There will be a autocomplete function with the possibilty to see the route, from your current position to the parking spot, which can be a bit more helpful for users in the future.

## Functionalities

- A landing page
- User registration, login (with session tokens), logout function
- Map page - browse through the districts, to display all spots or display one particular spot
- Write Reviews, or read reviews
- Add parking spots to your favorites
- User Profile with favorites listed and displayed on Google Maps

## Technologies

- Next.js
- TypeScript
- JavaScript
- PostgreSQL
- Emotion/css
- Playwright for E2E testing
- DrawSQL
- Photoshop for Design, building backgrounds and UI/UX components
- FIGMA

## Screenshots

### Landing page

![Screenshot of the landing page](/public/screenshots/landingpage1.png 'This is the landing page1')

![Screenshot of the landing page](/public/screenshots/landingpage2.png 'This is the landing page2')

### Empty Profile Page

![Screenshot empty Profile Page](/public/screenshots/emptyprofilepage.png 'Empty Profile page without favorites')

### Profile Page with favorites added

![Screenshot of the profile page](/public/screenshots/profilepagefavorites.png 'Profile page with favorites added')

### Map Page

![Screenshot of the map page/ the actual app itself](/public/screenshots/mappage.png 'Dropdown Menu, more information of the streets and add to favorites + review area')

![Screenshot of the map page/ the actual app itself](/public/screenshots/streetcard.png 'Dropdown Menu, more information of the streets and add to favorites + review area')

### Review Window

![Screenshot of the review modal](/public/screenshots/reviewwindow.png 'Modal for reviews opened')

### LoginPage

![Screenshot of the Login Page](/public/screenshots/loginpage.png 'Login Page')

### Register Page

![Screenshot of the Register Page](/public/screenshots/registerpage.png 'Register Page')
