
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Grid,
    Paper,
    IconButton,
    Typography
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { useInvoices } from '../context/InvoiceContext';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addInvoice, updateInvoice, deleteInvoice, getInvoice } = useInvoices();
    const isCreateMode = id === '0';

    const defaultValues = isCreateMode ? {
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        billingAddress: '',
        shippingAddress: '',
        gstin: '',
        items: [{ id: '1', itemName: '', quantity: 1, price: 0, amount: 0 }],
        billSundrys: [],
        totalAmount: 0
    } : getInvoice(id);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues
    });

    const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
        control,
        name: 'items'
    });

    const { fields: sundryFields, append: appendSundry, remove: removeSundry } = useFieldArray({
        control,
        name: 'billSundrys'
    });

    const items = watch('items');
    const billSundrys = watch('billSundrys');

    useEffect(() => {
        const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const sundryTotal = billSundrys.reduce((sum, sundry) => sum + parseFloat(sundry.amount || '0'), 0);
        setValue('totalAmount', itemsTotal + sundryTotal);
    }, [items, billSundrys, setValue]);

    const onSubmit = (data) => {
        try {
            if (isCreateMode) {
                addInvoice(data);
            } else {
                updateInvoice({ ...data, id });
            }
            navigate('/invoices');
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            deleteInvoice(id);
            navigate('/invoices');
        }
    };

  
    return (
        <Paper style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {isCreateMode ? 'Create Invoice' : 'Update Invoice'}
                        </Typography>
                    </Grid>

                  
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}
                            {...register('date', { required: true })}
                            error={!!errors.date}
                            helperText={errors.date ? 'Date is required' : ''}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            {...register('customerName', { required: true })}
                            error={!!errors.customerName}
                            helperText={errors.customerName ? 'Customer name is required' : ''}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Billing Address"
                            multiline
                            rows={3}
                            {...register('billingAddress', { required: true })}
                            error={!!errors.billingAddress}
                            helperText={errors.billingAddress ? 'Billing address is required' : ''}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Shipping Address"
                            multiline
                            rows={3}
                            {...register('shippingAddress', { required: true })}
                            error={!!errors.shippingAddress}
                            helperText={errors.shippingAddress ? 'Shipping address is required' : ''}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="GSTIN"
                            {...register('gstin', { required: true })}
                            error={!!errors.gstin}
                            helperText={errors.gstin ? 'GSTIN is required' : ''}
                        />
                    </Grid>

            
                    <Grid item xs={12}>
                        <Typography variant="h6">Items</Typography>
                        {itemFields.map((field, index) => (
                            <Grid container spacing={2} key={field.id} style={{ marginBottom: '10px' }}>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Item Name"
                                        {...register(`items.${index}.itemName`, { required: true })}
                                        error={!!errors.items?.[index]?.itemName}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Quantity"
                                        {...register(`items.${index}.quantity`, {
                                            required: true,
                                            min: 1
                                        })}
                                        error={!!errors.items?.[index]?.quantity}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Price"
                                        {...register(`items.${index}.price`, {
                                            required: true,
                                            min: 0.01
                                        })}
                                        error={!!errors.items?.[index]?.price}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Amount"
                                        value={items[index]?.quantity * items[index]?.price || 0}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton onClick={() => removeItem(index)} disabled={itemFields.length === 1}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => appendItem({ id: '', itemName: '', quantity: 0, price: 0, amount: 0 })}
                        >
                            Add Item
                        </Button>
                    </Grid>

                   
                    <Grid item xs={12}>
                        <Typography variant="h6">Bill Sundrys</Typography>
                        {sundryFields.map((field, index) => (
                            <Grid container spacing={2} key={field.id} style={{ marginBottom: '10px' }}>
                                <Grid item xs={5}>
                                    <TextField
                                        fullWidth
                                        label="Sundry Name"
                                        {...register(`billSundrys.${index}.billSundryName`)}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Amount"
                                        {...register(`billSundrys.${index}.amount`)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => removeSundry(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => appendSundry({ id: '', billSundryName: '', amount: '0' })}
                        >
                            Add Sundry
                        </Button>
                    </Grid>

             
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Total Amount"
                            value={watch('totalAmount')}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{ marginRight: '10px' }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/invoices')}
                            style={{ marginRight: '10px' }}
                        >
                            Cancel
                        </Button>
                        {!isCreateMode && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default InvoiceDetail;