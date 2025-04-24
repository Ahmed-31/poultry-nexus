import UomTable from "@/src/components/Stock/Uom/UomTable.jsx";
import UomGroupTable from "@/src/components/Stock/Uom/UomGroupTable.jsx";
import DimensionTable from "@/src/components/Stock/Uom/DimensionsTable.jsx";

const UomPage = () => {
    return (
        <div className={"p-6"}>
            <section>
                <UomTable/>
            </section>
            <section>
                <UomGroupTable/>
            </section>
            <section>
                <DimensionTable/>
            </section>
        </div>
    )
}

export default UomPage;
