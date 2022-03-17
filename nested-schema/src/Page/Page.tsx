import * as React from "react";
import { schemaA, schemaB } from "./data";
import NestedSchemaTable from "./NestedSchemaTable";

function Page() {
    return (
        <div>
            {/* some buttons here */}
            <NestedSchemaTable schemaA={schemaA} schemaB={schemaB} />
        </div>
    );
}

export default Page;
