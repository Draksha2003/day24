const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
const { isEmail } = require('validator');

mongoose.connect("mongodb://localhost:27017/biography");
const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const itemschema=new mongoose.Schema({
	cm_name:{
		type:String,
		required:true
	},
	cm_id:{
		type:Number,
		required:true
	},
	cm_dob:{
		type:Date,
		required:true
	},
	cm_mstatus:{
		type:Boolean,
		required:true
	},
	cm_salary:{
		type:Number,
		required:true
	},
	cm_address:{
		type:[{
			city:{
				type:String,
				required:true
			},
			pincode:{
				type:Number,
				required:true
			}
		}],

		required:true
	},
	cm_email:{
		type:String,
		required: [true, 'User email is required'],
        match: [emailRegex, 'Please provide a valid email address']
      
	}

});

const Item=mongoose.model('cm_info',itemschema);

app.get('/items',async(req,res)=>{
	const items=await Item.findMany()
	res.send(items);
});

app.get('/items/:id',async(req,res)=>{
	const items=await Item.findOne({_id:req.params.id});
	res.send(items);
});




app.post('/items',async(req,res)=>{
	const item=new Item({
		cm_name:req.body.cm_name,
		cm_id:req.body.cm_id,
		cm_dob:req.body.cm_dob,
		cm_salary:req.body.cm_salary,
		cm_address:req.body.cm_address,
		cm_email:req.body.cm_email,
		cm_mstatus:req.body.cm_mstatus

	});
	await item.save();
	res.send(item);
});

app.put('/items/:id',async(req,res)=>{
	const item=await Item.findByIdAndUpdate(
		req.params.id,
		req.body,
		{new:true}
	);
	res.send(items);
});


app.delete('/items/:id',async(req,res)=>{
	await Item.findByIdAndDelete({_id:req.params.id});
	res.send({message:'Item deleted'});
});

app.listen(4000,()=>{
	console.log('sever is running on port 4000');
});