# New-Watchrockets

UPDATE: This version of WatchRockets.com has been completely rewritten using JQuery for reliability and ease of use.  It now features much faster loading times, and more accurate dates and times.  While this version is still very much a work in progress and does not include some features of the previous version, it is a much more reliable source of launch information than the original version of the site.


WatchRockets.com displays up-to-date information for upcoming rocket launches with data provided by LaunchLibrary.net API

Scripting is written entirely in Javascript as practice for learning the language and using its many different features, including http requests, asynchronous functions, looping through JSON data, DOM manipulation, click events, and dynamically creating content.

The script begins by making an http call to LaunchLibrary.net API, which returns a JSON object of every known upcoming rocket launch, and every detail about each launch. The data is passed asynchronously into the display function, which pulls out the information I want to display, and stores each in an array. The data then loops through each array to generate html displaying the data for each launch.

After the content has been generated, the functions below then limit the amount of launches displayed on the main screen to prevent an uneccessarily long page on load. They also create admin generated labels for certain launches with information that is not available from the JSON data, such as weather data and interesting facts. Finally, all of the data is made sortable by launch provider by applying a hidden class to all other poviders on click of the active providers sort button.

While there are certainly more graceful ways to create this site with the information available, I feel good about this as my first attempt at creating something more than a menu toggle button with javascript. And it provides me with a way to share my passion hobby of rockets and space with anyone who comes across the site.
