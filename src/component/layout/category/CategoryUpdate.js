import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, React } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from "react-router-dom"
import slugify from "slugify";
import { db } from '../../../firebase/fire-config';
import { Button } from '../../button';
import { Radio } from '../../checkbox';
import { Field, FieldCheckboxes } from '../../field';
import { Input } from '../../input';
import { Label } from '../../label';
import DashboardHeading from '../dashboard/DashboardHeading';
import { toast } from "react-toastify";
const CategoryUpdate = () => {
    const { control, reset, handleSubmit, watch, formState: { isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {

        }
    })
    const watchStatus = watch("status")
    const navigate = useNavigate();
    const [params] = useSearchParams()
    const categoryId = params.get("id");
    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "categories", categoryId)
            const result = await getDoc(colRef)
            console.log("🚀 ~ file: CategoryUpdate.js ~ line 27 ~ fetchData ~ doc", result.data())
            reset(result.data()) // hiển thị dữ liệu lên input
        }
        fetchData();
    }, [categoryId, reset])
    const handleUpdate = async (values) => {
        console.log(values);
        const colRef = doc(db, "categories", categoryId);
        updateDoc(colRef, {
            name: values.name,
            slug: slugify(values.slug || values.name, { lower: true }),
            status: Number(values.status),
        })
        toast.success("Update category successfully!");
        navigate("/manage/category")
    }
    if (!categoryId) return null;
    return (
        <div>
            <DashboardHeading title="Update category" desc={`Update your category id : ${categoryId}`}></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdate)} autoComplete="off">
                <div className="form-layout">
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            name="slug"
                            placeholder="Enter your slug"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === 1}
                                value={1}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === 2}
                                value={2}
                            >
                                Unapproved
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    className="mx-auto w-[230px]"
                >
                    Update category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;