import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate"
import { Form, Formik, ErrorMessage, Field } from "formik";
import * as yup from "yup"

export function OrderList() {
    const [orders, setOrder] = useState([])
    const [products, setProduct] = useState([])
    const getAll = async () => {
        const rs = await axios.get("http://localhost:8080/api/orders")
        setOrder(rs.data)
    }
    const getAllProduct = async () => {
        const rs = await axios.get("http://localhost:8080/api/product")
        setProduct(rs.data)
    }
    useEffect(() => {
        getAllProduct()
        getAll()
    }, [])
    if (!orders || !products) {
        return null
    }

    const deleteCus = async (id) => {
        await axios.delete('http://localhost:8080/api/orders/' + id)
        console.log(id)
        Swal.fire({
            icon: "success",
            title: "Delete success",
            timer: "3000"
        })
        getAll()
    }
    const deleteClick = async (id, name) => {
        Swal.fire({
            icon: "warning",
            title: `Do you want to delete Order <span >DH-${name}</span>?`,
            showCancelButton: true,
            confirmButtonText: "Oke"
        })
            .then((rs) => {
                if (rs.isConfirmed) {
                    deleteCus(id)
                }
            })
    }
    return (
        <>

            <div className="container text-center">
                <h3 >Order List</h3>
                <NavLink to='/add' className="btn btn-warning"> Add new</NavLink>
                <Formik
                    initialValues={{
                        product: 0,
                        dayOrder: ""

                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        const search = async () => {
                            setSubmitting(false)
                            const rsa = await axios.get(`http://localhost:8080/orders/search?p=${values.product}&d=${values.dayOrder}`)
                            setOrder(rsa.data)
                        }
                        search();
                    }}
                >
                    <Form className="d-flex">
                        <div className="  inputs">
                            <Field
                                as="select"
                                name="productId"
                                className="form-control"
                            >
                                <option value="">Sản phẩm</option>
                                {
                                    products.map((p) => (
                                        <option value={p.id}>{p.name}</option>
                                    ))
                                }

                            </Field>
                        </div>
                        <div className="  inputs">
                            <Field
                                type="date"
                                className="form-control"
                                name="dayOrder"
                                placeholder="Ngày mua"
                            />

                        </div>
                        <div >
                            <button type="submit" className=" btn btn-success ">
                                <b>Search</b>
                            </button>
                        </div>
                        <button type="button" style={{ marginLeft: "3px" }} onClick={() => getAll()} className=" btn btn-primary ">
                            <b>Reset</b>
                        </button>
                    </Form>
                </Formik>
                <table className="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã đơn hàng</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Loại sản phẩm</th>
                            <th>Ngày mua</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền(USD)</th>
                            <th>Action</th>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            orders.map((order) => (
                                <tr>
                                    <td>{order.id}</td>
                                    <td>DH-{order.id}</td>
                                    <td>{order.product.name}</td>
                                    <td>{order.product.price}</td>
                                    <td>{order.product.typeProduct}</td>
                                    <td>{order.dayOrder}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.totalMoney}</td>
                                    <td>
                                        <NavLink to={`/edit/${order.id}`} className="btn btn-info">
                                            Edit
                                        </NavLink>
                                        <a
                                            onClick={() => deleteClick(order.id, order.id)}
                                            className="btn btn-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                        >
                                            Delete
                                        </a>
                                    </td>
                                </tr>

                            ))
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}