# async
 
**Run migration**

`npm run db:migrate`

> This will insert 100 user to DB

**Serve app on development**

`npm run dev`

**Serve app**

`npm run start`

### Routes

- /generate-users
> Insert users to users collection

**Params**  
*count : Number - number of users*  
  
- /update-manual
> update users with manual concurrency process  

**Params**  
*points : Number - points to update*  
*num_users : Number - number of users to update*  
*concurrency : Number - number of process running at the same time*  

- /update-raw
> update users manually one by one

**Params**  
*points : Number - points to update*  
*num_users : Number - number of users to update*  

- /update-all
> update users wit Promise.all

**Params**  
*points : Number - points to update*  
*num_users : Number - number of users to update*  

- /update-reduce
> update users wit Array.reduce

**Params**  
*points : Number - points to update*  
*num_users : Number - number of users to update*  
