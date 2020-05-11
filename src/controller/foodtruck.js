import mongoose from 'mongoose';
import { Router } from 'express';
import Foodtruck from '../model/foodtruck';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';

export default({config, db}) => {
    let api = Router();

    // /v1/foodtruck/add - post
    api.post('/add', authenticate, (req, res) => { //needs authentication
        let newTruck = new Foodtruck();
        newTruck.name = req.body.name;
        newTruck.foodtype = req.body.foodtype;
        newTruck.avgcost = req.body.avgcost;
        newTruck.geometry.coordinates = req.body.geometry.coordinates;

        newTruck.save(err => {
            if(err){
                res.send(err);
            }
            res.json({ message: 'Food truck saved successfully'});
        });
    });

    // /v1/foodtruck/reviews/:id
    api.get('/reviews/:id', (req, res) => {
        Review.find({foodtruck: req.params.id}, (err, reviews) => {
            if(err){
                res.send(err);
            }
            res.json(reviews);
        });
    });

    // /v1/foodtruck/ - get
    api.get('/', (req, res) => {
        Foodtruck.find({}, (err, foodtrucks) => {
            if(err){
                res.send(err);
            }
            res.json(foodtrucks);
        });
    });

    // /v1/foodtruck/:id - getById
    api.get('/:id', (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {
            if(err){
                res.send(err);
            }
            res.json(foodtruck);
        });
    });

    // /v1/foodtruck/:id - updateById - put
    api.put('/:id', authenticate, (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {
            if(err){
                res.send(err);
            }
            foodtruck.name = req.body.name;
            foodtruck.save(err => {
                if(err){
                    res.send(err);
                }
            res.json({ message: "Food truck info updated"});
            });
        });
    });

    // /v1/foodtruck/:id 
    api.delete('/:id', authenticate, (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) =>{
            if(err){
                res.status(500).send(err);
                return;
            }
            if(foodtruck === null){
                res.status(404).send("Foodtruck not found");
                return;
            }
            Foodtruck.remove({ _id: req.params.id }, (err, foodtruck) => {
                if(err){
                    res.status(500).send(err);
                    return;
                }
                Review.remove({foodtruck: req.params.id}, (err, review) =>{
                    if(err){
                        res.send(err);
                    }
                    res.json({ message: "The Food truck and its reviews was successfully deleted"}); 
                });
           });
        });
    });

    // add review for a specific food truckId
    // '/v1/foodtruck/reviews/add/:id'
    api.post('/reviews/add/:id', authenticate, (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {
            if(err){
                res.send(err);
            }
            let newReview = new Review();

            newReview.title = req.body.title;
            newReview.text = req.body.text;
            newReview.foodtruck = foodtruck._id;
            newReview.save((err, review) => {
                if(err){
                    // res.json({message: "fails here"});
                    res.send(err);
                }
                foodtruck.reviews.push(newReview);
                foodtruck.save(err =>{
                    if(err){
                        res.send(err);
                    }
                    res.json({ message: "Review was published"});
                });
            });
        });
    });

    // /v1/foodtruck/foodtype/:foodtype
    api.get('/foodtype/:foodtype', (req, res) =>{
        Foodtruck.find({foodtype: req.params.foodtype.toLowerCase()}, (err, foodtruck) =>{
            if(err){
                res.send(err);
            }
            res.json(foodtruck);
        });
    });

    return api;
}