# Gift Closet (Node.js/Express Server)

View the live application at: https://gift-closet.vercel.app/

Table of Contents:\
[Application Summary](#application-summary)\
[API Documentation](#api-documentation)\
[API Endpoints](#endpoints)

## Application screenshot

![gift closet screenshot](https://github.com/jakeelizondo/gift-closet-api/blob/master/src/images/gift-closet-screenshot.PNG)

### Application Summary

Gift Closet is a CRUD application built on Node.js, with Express and Knex as the primary libraries for server and database construction and integration. The application is designed to allow users to store gift ideas and add custom tags to those gifts which they can later filter by for easy access. Users can add, edit, and delete gifts as well as add, edit, and delete their custom tags at any time. They can filter by custom tag on their My Gifts page to view only gifts with that tag.

### Technology used

This application was built with Node.js, Express, Knex, and many smaller libraries to help with specific functions like security, authorization, etc.

#### To install locally

1. Clone github repo to your machine
2. Run command 'npm install' to install dependencies locally
3. Run command 'npm run dev' to start up server locally

## API Documentation

### Authorization

All API requests to protected endpoints require the use of a bearer token. You can generate a new one by submitting a successful POST request to the /api/login endpoint with a valid username and password.

To authenticate an API request, you should provide your bearer token in the `Authorization` header.

### Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, the application will respond with a JSON response in the following format:

```javascript
{
  "error" : {"message": string}
}
```

The `message` attribute contains a message conveying the nature of the error.

### ENDPOINTS

---

### Public Endpoints

```http
POST /api/register
```

| Parameter    | Type     | Description                         |
| :----------- | :------- | :---------------------------------- |
| `user_name`  | `string` | **Required**. User desired username |
| `password`   | `string` | **Required**. User desired password |
| `first_name` | `string` | **Required**. User first name       |
| `last_name`  | `string` | **Required**. User last name        |
| `email`      | `string` | **Required**. User email            |

### Status Codes

This API returns the following status codes:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

---

For questions/feedback or to discuss employment/project opportunities, contact the creator via email at jake.elizondo23@gmail.com
