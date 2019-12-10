import express, {Router} from "express";
import {Request, Response} from "express";
import {getCollection} from "../functions/mongo.functions";
import {Beacon} from "../entities/beacon";
import {timeLog} from "../functions/express.functions";
const router: Router = express.Router();
router.use(timeLog);
router.get('', (req: Request, res: Response) => {
    //const collection: any = getCollection('beacons');
    /*collection.find({}).toArray((err: any, items: any) => {
        if (err) {
            res.status(500);
            res.end();
            console.error('Caught error', err);
        } else {
            items = items.map((item: any) => { return { id: item._id, description: item.description}});
            res.json(items);
        }
    });*/
    res.json({hello: 'cc'});
});

router.get('/beacon/:id', (req: Request, res: Response) => {
    const collection: any = getCollection('beacons');
    console.log(req.baseUrl);
    collection.find({}).toArray((err: any, items: any) => {
        if (err) {
            res.status(500);
            res.end();
            console.error('Caught error', err);
        } else {
            items = items.map((item: any) => { return { id: item._id, description: item.description}});
            res.json(items);
        }
    });
});

router.post('',(req: Request, res: Response) => {
   // const b: Beacon = req.body;
    res.json({beacon_id: 'test'});
});

router.delete('/beacon:id', (req: Request, res: Response) => {

});

exports.beaconRouter = router;
