
type Ioptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: string;
    sortBy?: string;


}

type IoptionsResult = {
    page:number;
    limit:number;
    skip:number;
    sortBy:string;
    sortOrder:string
}

const paginationSortingHelper = (options: Ioptions):IoptionsResult => {

    const page:number= Number(options.page) ||1;
    const limit:number = Number(options.limit) ||10;
    const skip = (page-1)*limit;
    const sortBy:string = options.sortBy || "createAt";
    const sortOrder:string = options.sortOrder || "desc";



    return{
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }

return options
}
export default paginationSortingHelper;