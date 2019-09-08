import * as functions from 'firebase-functions';
import * as calendar from 'ics';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const hello = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const dummy = functions.https.onRequest((request, response) => {
    const hours = (new Date().getHours() % 12) + 1  // London is UTC + 1hr;
    response.status(200).send(`<!doctype html>
      <head>
        <title>Time</title>
      </head>
      <body>
        ${'BONG '.repeat(hours)}
      </body>
    </html>`);
});

export const ics = functions.https.onRequest((request, response) => { 
    const event = {
        start: request.query.start.split('-').map((i: string) => parseInt(i)),
        end: request.query.end.split('-').map((i: string) => parseInt(i)),
        title: request.query.title,
        description: request.query.description,
        location: request.query.location,
        url: request.query.url
    }
    const isDebug = request.query.d == 1
    calendar.createEvent(event, (error: any, value: any) => {
        if(error) {
            response.status(400)
                .send(error.name + "\n" + error.details.message)
        } else {
            if (!isDebug) response.type('text/calendar')
            response.status(200)
                .send(value)
        }
    });
});
