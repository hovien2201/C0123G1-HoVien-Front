import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, Navigate, navigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate"
import { Form, Formik, ErrorMessage, Field } from "formik";
import * as yup from "yup"
// import * as navigate from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";

export function EditOrder() {
    const param = useParams()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState({})
    const [orders, setOrder] = useState()
    const getAllProduct = async () => {
        const rs = await axios.get("http://localhost:8080/api/product")
        setProducts(rs.data)
    }
    const getProduct = async (id) => {

        for (let index = 0; index < products.length; index++) {
            if (products[index].id == id) {
                setProduct(products[index])
            }

        }
        console.log(product)
    }
    const findOrder = async () => {
        const res = await axios.get('http://localhost:8080/api/orders/' + param.id);
        setOrder(res.data)
        
    }
    useEffect(() => {
        getAllProduct()
        findOrder()
        console.log(orders)
    }, [])
    if (!products || !orders) {
        return null
    }
    
    return (
        <>
            <Formik
                initialValues={
                    {
                        dayOrder: orders?.dayOrder,
                        product: "",
                        totalMoney: orders?.totalMoney,
                        quantity: orders?.quantity

                    }}
                validationSchema={yup.object({
                    dayOrder: yup.date().max(new Date(), "Không chọn hơn ngày hiện tại").required("Bắt buộc nhập"),
                    product: yup.string().required("Vui lòng chọn"),
                    quantity: yup.number().required("Bắt buộc nhập").min(1, "Lớn hơn 0")
                })}
                onSubmit={(values, { setSubmitting }) => {
                    const create = async () => {
                        values = {
                            ...values,
                            id:param.id,
                            product: product,
                            dayOrder: values.dayOrder,
                            quantity: values.quantity,
                            totalMoney: values.quantity*product.price
                        }
                        setSubmitting(false)
                        await axios.put('http://localhost:8080/api/orders', values)
                        Swal.fire({
                            icon: "success",
                            title: "Chỉnh sửa thành công",
                            timer: "3000"
                        })
                        console.log(values)
                        navigate("/")
                    }
                    create();
                }}
            >
                <div className="container mt-5 mb-5 ">
                    <div
                        className="row height d-flex justify-content-center align-items-center"

                    >
                        <div className="col-md-6">
                            <div className="card px-5 py-4">
                                <div  >
                                    <h2 style={{ textAlign: "center" }}>Add new Order</h2>
                                </div>
                                <Form>
                                    <div className=" mt-4 inputs">
                                        <Field
                                            type="date"
                                            className="form-control"
                                            name="dayOrder"
                                            placeholder="Ngày mua"
                                        />
                                        <ErrorMessage name="dayOrder" component="span" className="error-r" />

                                    </div>
                                    <div className=" mt-4 inputs">
                                        <Field

                                            as="select"
                                            name="product"
                                            className="form-control"
                                            onClick={(val) => getProduct(val.target.value)}
                                        >
                                            <option value="">Sản phẩm</option>
                                            {
                                                products.map((p) => (
                                                    <option value={p.id}>{p.name}</option>
                                                ))
                                            }


                                        </Field>
                                        <ErrorMessage name="product" component="span" className="error-r" />
                                    </div>
                                    <div className=" mt-4 inputs d-flex">
                                        <h3>Giá sản phẩm: </h3>
                                        <h3 style={{fontWeight:"400"}}>{product.price} USD</h3>
                                    </div>

                                    <div className="row mt-4  ">

                                        <div className="** form-group mt-3 mt-md-0">
                                            <Field
                                                type="number"
                                                className="form-control"
                                                name="quantity"
                                                placeholder="Số lượng"
                                            />
                                            <ErrorMessage name="quantity" component="span" className="error-r" />

                                        </div>
                                    </div>

                                    <div className="text-center m-auto mt-4">
                                        <button type="submit" className=" btn btn-success ">
                                            <b className="text-center">Save</b>
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>

                </div>
            </Formik>
        </>
    )
}