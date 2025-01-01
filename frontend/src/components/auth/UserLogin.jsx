import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosClient } from "../../api/axios";
import { useNavigate } from "react-router-dom";



const formSchema = z.object({
  email: z.string().email().min(2).max(50),
  password: z.string().min(8).max(30),
});

export default function UserLogin() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@gmail.com",
      password: "123456789",
    },
  });
  const {setError ,formState: { isSubmitting }} = form;

  const onSubmit = async (values) => {
    await axiosClient.get("/sanctum/csrf-cookie");
    const data = axiosClient
      .post("/login", values)
      .then((values) => {
        if (values.status === 204) {
          navigate("/dashboard");
        }
      })
      .catch(({response}) => {
       
         
          setError("email", {
            message: response.data.errors.email.join(),
          });
          // for (const error in response.data.errors) {
          //   console.log(error);
          // }
          
       
      });
     
    console.log(data);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit">
          Login {isSubmitting && <Loader2 className="mx-2 my-2 animate-spin"/>}
          </Button>
        </form>
      </Form>
    </>
  );
}
