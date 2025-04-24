import React, {useState} from "react";
import DataTable from "react-data-table-component";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const Section = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white border rounded-lg p-4 shadow mb-4">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-semibold text-lg">{title}</h4>
                <span>{isOpen ? "▼" : "▶"}</span>
            </div>
            {isOpen && <div className="mt-2">{children}</div>}
        </div>
    );
};

const ExpandedUomDetails = ({data}) => {
    const {t} = useTranslation();
    const productsColumn = [
        {name: t('uomDetails.tableHeaders.productName'), selector: row => row.name, sortable: true},
        {
            name: t('uomDetails.tableHeaders.description'),
            selector: row => row.description || t('global.na'),
            sortable: true
        },
        {
            name: t('uomDetails.tableHeaders.sku'),
            selector: row => row.sku,
            sortable: true
        },
        {
            name: t('uomDetails.tableHeaders.type'),
            selector: row => t(`categoriesNames.${row.type}`),
            sortable: true
        },
    ];

    const dimensionsColumns = [
        {
            name: t('uomDetails.tableHeaders.dimensionName'),
            selector: row => t(`dimensions.${row.name}`),
            sortable: true
        },
    ];

    const currentLang = useSelector((state) => state.language.current);

    return (
        <div className="p-4 bg-gray-50 border rounded space-y-4">
            <h3 className="text-xl font-bold mb-4">📦 {t('uomDetails.title')}: {t(`uoms.${data.name}`)}</h3>

            <Section title={t('uomDetails.sections.metadata')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>{t('uomDetails.groupName')}:</strong> {t(`uomGroups.${data.group?.name}`) || t('global.na')}
                    </div>
                </div>
            </Section>

            {data.products?.length > 0 && (
                <Section title={t('uomDetails.sections.products')}>
                    <DataTable
                        key={currentLang}
                        columns={productsColumn}
                        data={data.products}
                        noHeader
                        dense
                        striped
                        highlightOnHover
                    />
                </Section>
            )}

            {data.dimensions?.length > 0 && (
                <Section title={t('uomDetails.sections.dimensions')}>
                    <DataTable
                        key={currentLang}
                        columns={dimensionsColumns}
                        data={data.dimensions}
                        noHeader
                        dense
                        striped
                        highlightOnHover
                    />
                </Section>
            )}
        </div>
    );
};

export default ExpandedUomDetails;
