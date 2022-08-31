
import Template from '../Database/Template.js';

const saveTemplate = async(req,res)=>{
    try{
        let body = req.body;
        let savetemp = new Template(body);
        const result =  await savetemp.save()
        res.status(201).send(result);
    }
    catch(err){
        res.status(201).send(err);
    }

}


const getTemplate = async(req,res)=>{
    let shop = req.params.shop;
    const result = await Template.find({shop:shop})
    res.status(200).send(result);
}  


const updateTemplate = async(req,res)=>{
    let id = req.params.id;
    let data = req.body;
    console.log('data>>>>',data)
    const result = await Template.findByIdAndUpdate({_id:id},{$set:{data}})
    res.status(200).send(result);
}

  
export default {saveTemplate,getTemplate,updateTemplate}