class APIFeatures {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        if(this.queryString){
        
            const queryStringObj = {...this.queryString};
            const excludeFields = [
                "page",
                "sort",
                "limit",
                "fields",
            ]
            excludeFields.forEach((el,id)=>{
    
                if(queryStringObj[el]){
                    delete queryStringObj[el];
                }
            })
    
            let queryStr = (JSON.stringify(queryStringObj)).replace(/\b(gt|gte|lt|lte)\b/g,(match)=> `$${match}`)
            console.log(queryStr)
            this.query.find(JSON.parse(queryStr));
            return this;
        }else{
            this.query.find();
            return this;

        }
    }
    fields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(",").join(" ");
          
            this.query.select(fields);

        }
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sort = this.queryString.sort.split(",").join(" ");
            this.query.sort(sort);
        }
        return this;
    }
    limit(){
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 10;
        const skip = (page -1)*limit;
        this.query.skip(skip).limit(limit)
        return this;
    }
}
export default APIFeatures;