/*
Shanna Benammar
Create a room with a 'sconce' and a ball that displays lighting and reflection.
*/  

//Scene creation
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000, 0);
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer, scene); 

//initial values for gui controls
var guiValues = {
        ambientOn: true,
        directionalOn: true,
        spotlightOn: true,
        last: null
};

//values used to create the ball
var ballValues = {
        radius: 50,
        color:  0x682C9C,
        position: new THREE.Vector3(-175, -250, -200)
};

//values for the wall colors of the room
var roomValues = {
        wallColor : 0x55A2F7,
        ceilingColor : 0x0A7329,
        floorColor : 0xFFCC99
};

//values used for the different light in the room
var lightValues = {
        spotlightAngle : 30,
        directionOne : new THREE.Vector3(0, -1, 0),
        directionTwo : new THREE.Vector3(0, 1, 0),
        ambient : new THREE.AmbientLight(0x808080),
        directional : new THREE.DirectionalLight(0xffffff, 0.7)
};

//values used to create the cones which will make the shape of the 'sconce'
var sconceValues = {
        sconceHeight : 48,
        sconceColor : 0x79797A,
        sconcePosition : new THREE.Vector3(-175, +55, -230)
};
   
 /*
 function Cone()
 Input:
 height- sets the height for the cones using the sconceHeight value from the sconceValues variable 
 angle- sets the position for the cones in the scene using the sconcePosition value from the sconceValues variable 
 color- sets the color for the cones in the scence using the sconceColor value from the sconceValues variable
 Output:
 returns the coneShell (cone object) to be displayed once the function is called
 Function:
 creates the cones with the input values using THREE.js functions
 */
function Cone(height, angle, color){
       var coneShell = new THREE.Object3D();
        var position = height * Math.tan(TW.degrees2radians(angle));
        var coneGeom = new THREE.CylinderGeometry(0, 23, height, 30, 1, true);
        var coneMesh = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
        var cone = new THREE.Mesh(coneGeom, coneMesh);
        cone.position.y = -height / 2;
        coneShell.add(cone);
        return coneShell;
}
 /*
 function spotLight()
 Input:
 scene- holds the scene for adding the lights to
 angle- sets the angle for the lights in the scene using the spotLightAngle value from the lightValues variable 
 pos- sets the position for the light in the scence using the sconcePosition value from the sconceValues variable
 direction- sets the direction for the light to face in using the directionOne value from lightValues variable
 Output:
 N/A
 Function:
 creates the lights with the input values using THREE.js functions
 adds the created lights to the scene 
 */
function spotLight(scene, angle, pos, direction){
        var position = TW.degrees2radians(angle);
        var light = new THREE.SpotLight(0xFFFFFF, 1, 0, position);
        light.intensity = 2;
        light.position.copy(pos);
        light.target.position.set(pos.x + direction.x, pos.y + direction.y, pos.z + direction.z);
        light.name = "spotLight1";
        scene.add(light);  
        scene.add(light.target);
}
 /*
 function spotLight2()
 **Same as function spotLight()-
 created to provide a different name value for the second spotlight-used by GUI controls
 Input:
 scene- holds the scene for adding the lights to
 angle- sets the angle for the lights in the scene using the spotLightAngle value from the lightValues variable 
 pos- sets the position for the light in the scence using the sconcePosition value from the sconceValues variable
 direction- sets the direction for the light to face in using the directionTwo value from lightValues variable
 Output:
 N/A
 Function:
 creates the lights with the input values using THREE.js functions
 adds the created lights to the scene 
 */
function spotLight2(scene, angle, pos, direction){
        var position = TW.degrees2radians(angle);
        var light2 = new THREE.SpotLight(0xFFFFFF, 1, 0, position);
        light2.intensity = 1.5;
        light2.position.copy(pos);
        light2.target.position.set(pos.x + direction.x, pos.y + direction.y, pos.z + direction.z);
        light2.name = "spotLight2";
        scene.add(light2);  
        scene.add(light2.target);
}
 /*
 function addball()
 Input:
 scene- holds the scene for adding the lights to
 radius- sets the radius for the ball in the scene using the radius value from the ballValues variable 
 color- sets the color for the ball in the scence using the color value from the ballValues variable
 floorPosition- sets the position of the ball on the floor using the position value from ballValues variable
 Output:
 N/A
 Function:
 creates the ball with the input values using THREE.js functions
 adds the created balls to the scene 
 */
function addBall(scene, radius, color, floorPosition) {
        var sphereGeometry = new THREE.SphereGeometry(radius, 50, 50);
        var sphereMaterial = new THREE.MeshPhongMaterial({color: color, specular: 0xA0A0A0});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(floorPosition);
        sphere.position.y += radius;
        scene.add(sphere);
}
/*
 function addRoom()
 Input:
 scene- holds the scene for adding the lights to
 Output:
 N/A
 Function:
 creates the walls with the input values using THREE.js functions
 adds the walls to the room
 adds the room to the scene
 */
function addRoom(scene){
   var roomMaterialArray = [
        new THREE.MeshPhongMaterial({ color: roomValues.wallColor, shading: THREE.SmoothShading, side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: roomValues.wallColor, shading: THREE.SmoothShading, side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: roomValues.ceilingColor, shading: THREE.SmoothShading, side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: roomValues.floorColor, shading: THREE.SmoothShading, side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: roomValues.wallColor, shading: THREE.SmoothShading, side: THREE.BackSide }),
        new THREE.MeshPhongMaterial({ color: roomValues.wallColor, shading: THREE.SmoothShading, side: THREE.BackSide }),
    ]; 
  
        var roomGeometry = new THREE.BoxGeometry(500, 500, 500);
        var roomMaterial = new THREE.MeshFaceMaterial(roomMaterialArray);
        var room = new THREE.Mesh(roomGeometry, roomMaterial);
        scene.add(room);
}

//creates the variable for the first cone to be added to the scene
//uses the Cone() functions which receives specific values
//sets specific position of the cone before adding it to the scene
var coneOne = Cone(sconceValues.sconceHeight, sconceValues.sconcePosition, sconceValues.sconceColor);
coneOne.position.copy(new THREE.Vector3(-175, +55, -230));
scene.add(coneOne);

//calls the spotLight() function which adds the light to the scene using specified values
//uses the spotLightName1 variable to get the name for the first light to be used for the GUI controls
spotLight(scene, lightValues.spotlightAngle, sconceValues.sconcePosition, lightValues.directionOne);
var spotLightName1 = scene.getObjectByName("spotLight1");
       
//creates the variable for the second cone to be added to the scene
//uses the Cone() functions which receives specific values
//sets specific position of the cone before adding it to the scene
var coneTwo = Cone(sconceValues.sconceHeight, sconceValues.sconcePosition, sconceValues.sconceColor);
coneTwo.position.copy(sconceValues.sconcePosition);
coneTwo.rotation.x = Math.PI;
scene.add(coneTwo);

//calls the spotLight() function which adds the light to the scene using specified values
//uses the spotLightName2 variable to get the name for the second light to be used for the GUI controls
spotLight2(scene, lightValues.spotlightAngle, sconceValues.sconcePosition, lightValues.directionTwo); 
var spotLightName2 = scene.getObjectByName("spotLight2");
 
//calles the addBall() function which creates the ball and adds it to the scene
addBall(scene, ballValues.radius, ballValues.color, ballValues.position);
      
//calls the addRoom() function which creates the room and adds it to the scene
addRoom(scene); 

//Conditional statements to test GUI inputs
      if (guiValues.directionalOn) {
             lightValues.directional.position.set(1, 1.5, 2);
             scene.add(lightValues.directional);
       }   
       if (guiValues.ambientOn) {
             scene.add(lightValues.ambient);
       }
//Sets up camera view using TW cameraSetup function
 TW.cameraSetup(renderer, scene, {
        minx: -250, maxx: 250,
        miny: -250, maxy: 250,
        minz: -250, maxz: 250
  });

//Creates the GUI variable which provides user controls for the scene
 var gui = new dat.GUI();

//Creates the options for the control window
//Each option procides a true or false value
//leads to a function that creates the change in the scene
    gui.add(guiValues, "ambientOn").onChange(function () {
        lightValues.ambient.visible = guiValues.ambientOn;
        TW.render()
    });
    gui.add(guiValues, "directionalOn").onChange(function () {
        lightValues.directional.visible = guiValues.directionalOn;
        TW.render()
    });
    gui.add(guiValues, "spotlightOn").onChange(function () {
         spotLightName1.visible = guiValues.spotlightOn;
         spotLightName2.visible = guiValues.spotlightOn;
         TW.render()
    })
