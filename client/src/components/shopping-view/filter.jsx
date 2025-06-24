import { Fragment } from "react";
import { filterOptions } from "../../config";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label"; // Adjust the path if needed
import { Separator } from "../ui/separator"; // Adjust the path if needed

function ProductFilter({filters, handleFilters}){
    return (
    <div className=" bg-background rounded-lg shadow-sm">
        <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">
            Filters
        </h2>
        </div>
        <div className="p-4 space-y-4">
              {
                Object.keys(filterOptions).map(keyItem=>(
                 <Fragment key={keyItem}>
                        <div>
                            <h3 className="text-base font-bold">
                                {keyItem}
                            </h3>
                            <div className="grid gap-2 mt-2">
                                {
                                    filterOptions[keyItem].map(option=> (
                                    <Label key={option.id} className="flex font-medium items-center gap-2">
                                    <Checkbox 
                                    checked={!!(filters && filters[keyItem] && filters[keyItem].indexOf(option.id) > -1)}
                                     onCheckedChange={() => handleFilters(keyItem, option.id)} 
                                    />
                                    
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                        <Separator/>
                    </Fragment>))
              }
        </div>

    </div>);
}

export default ProductFilter;