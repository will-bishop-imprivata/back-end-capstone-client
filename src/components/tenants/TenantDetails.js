import React, {useContext, useEffect, useState, forwardRef} from 'react'
import {PaymentContext} from '../payments/PaymentProvider'
import MaterialTable from "material-table"
import { useHistory } from "react-router-dom"
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { CakeSharp } from '@material-ui/icons';

export const TenantDetails = (props) => {
    const history = useHistory()
    const [total, setTotal] = useState("")
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])
    const {paymentByTenant, payments, paymentTypes, getPaymentTypes, singlePayment, getPayments, searchPayments, getSinglePayment, 
        postPayment, updatePayment, deletePayment, getTableTenants, tableTenants, getPaymentsByTenant, postPaymentTenantDetails} = useContext(PaymentContext)
    
    // Fetches and sets paymentByTenant, associated tenants 
    // and payment types on initial render
    useEffect(() => {
        getTableTenants()
        .then(getPaymentTypes)
        .then(() => 
            getPaymentsByTenant(parseInt(props.match.params.tenant_id))
        ) 
    }, [])

    useEffect(() => {
        getPaymentsByTenant(parseInt(props.match.params.tenant_id))
    }, [payments])


    useEffect(() => {
        setData(paymentByTenant.map(p => (
            {
                date: p.date,
                full_name: p.tenant.full_name,
                amount: '$'+p.amount,
                ref_num: p.ref_num,
                type: p.payment_type.id,
                tenant_id: p.tenant.id,
                payment_id: p.id
            }
            )))
    }, [paymentByTenant])

    // calculates the total payments rendered at a given time
    useEffect(() => {
        let sum = 0
        for (const payment of paymentByTenant){
            sum += payment.amount
        }
        setTotal(sum)
    }, [paymentByTenant])
    

    // sets the state for columns which gives instructions 
    // to the table for headers, fields and dropdowns 
    useEffect(() => {
        const newColumns = [
            {title: 'Date', field: 'date', type: "date"},
            {title: 'Name', field: 'full_name', editable: 'never'},
            {title: 'Payment', field: 'amount'},
            {title: 'Ref #', field: 'ref_num'},
            {title: 'Type', field: 'type', lookup: paymentTypes,},
            // add the tenant id to the columns so it's accessible when 
            // creating the tenant link but keep the column hidden
            {title: 'Tenant_Id', field: 'tenant_id', hidden: true},
            {title: 'Payment_Id', field: 'payment_id', hidden: true}
        ]
        setColumns(newColumns)
    }, [paymentTypes])

    // icons for the table
    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} className='deleteIcon icon'/>),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} className='editIcon icon'/>),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    return (
        <section className="payments">
            <aside className="payments--aside">
                <div>Total: ${total}</div>
            </aside>
            <div className="payments--list">
                <MaterialTable title={`Payments`}  // Add Tenant Name
                    columns={columns}
                    data={data}
                    icons={tableIcons}
                    options={{
                        paging: true,
                        pageSize: 20,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [5,10,20,50],
                        addRowPosition: 'first'
                    }}
                    editable={{
                        onRowAdd: payment => 
                        postPaymentTenantDetails(payment, parseInt(props.match.params.tenant_id)),  

                        onRowDelete: payment => 
                        deletePayment(payment.payment_id),
                        
                        onRowUpdate: payment => 
                        updatePayment(payment)
                    }}
                    />
            </div>
        </section>
    )
    
    
}