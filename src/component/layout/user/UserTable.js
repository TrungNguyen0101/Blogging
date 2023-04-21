import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/fire-config";
import { ActionDelete, ActionEdit, ActionView } from "../../actions";
import Table from "../../table/Table";
import { LabelStatus } from "../../label";
import { deleteUser } from "firebase/auth";
import { toast } from 'react-toastify';

import Swal from "sweetalert2";
const UserTable = () => {
    const [userList, setUSerList] = useState([]);
    console.log(
        "🚀 ~ file: UserTable.js ~ line 10 ~ UserTable ~ userList",
        userList
    );
    const navigate = useNavigate();
    useEffect(() => {
        const colRef = collection(db, "users");
        onSnapshot(colRef, (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUSerList(result);
        });
    }, []);
    const handleDelUser = async (user) => {
        const colRef = doc(db, "users", user.id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            // console.log("🚀 ~ file: CategoryManage.js ~ line 41 ~ handleDelCategory ~ result.isConfirmed", result.isConfirmed)
            if (result.isConfirmed) {
                await deleteDoc(colRef);
                await deleteUser(user);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
        // toast.success("Deleted user successfully")

    };
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Info</th>

                        <th>Email address</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 &&
                        userList.map((item) => (
                            <tr key={item.id}>
                                <td title={item.id}>{item.id.slice(0, 5) + "..."}</td>
                                <td>
                                    <div className="flex items-center gap-x-3 whitespace-nowrap">
                                        <img className="w-[40px] h-[40px] " src={item?.avatar} alt="" />
                                        <div className="flex-1">
                                            <h3 title={item.fullname}>
                                                {item.fullname}
                                            </h3>
                                            <time>
                                                {new Date(
                                                    item?.createAt?.seconds * 1000 || new Date()
                                                ).toLocaleDateString("Vi")}
                                            </time>
                                        </div>
                                    </div>
                                </td>
                                <td title={item.email}>{item.email.slice(0, 5) + "..."}</td>
                                <td>
                                    {Number(item.status) === 1 && (
                                        <LabelStatus type="success">Active</LabelStatus>
                                    )}
                                    {Number(item.status) === 2 && (
                                        <LabelStatus type="danger">Pending</LabelStatus>
                                    )}
                                    {Number(item.status) === 3 && (
                                        <LabelStatus type="warning">Rejected</LabelStatus>
                                    )}
                                </td>
                                <td>
                                    {Number(item.role) === 1 && (
                                        <LabelStatus >Admin</LabelStatus>
                                    )}
                                    {Number(item.role) === 2 && (
                                        <LabelStatus >Mod</LabelStatus>
                                    )}
                                    {Number(item.role) === 3 && (
                                        <span className="text-[17px] font-medium" >User</span>
                                    )}
                                </td>
                                <td>
                                    {" "}
                                    <div className="flex items-center gap-x-3">
                                        <ActionView></ActionView>
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(`/manage/update-user?id=${item.id}`)
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() => handleDelUser(item)}
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;
