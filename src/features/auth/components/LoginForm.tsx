import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';

const LoginForm = () => {
    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="w-full flex flex-col gap-2 items-center justify-center">
                <Input type="text" placeholder="ID" sizes="large" />
                <Input type="password" placeholder="Password" sizes="large" />
                <Button variant="primary" sizes="large" type="submit" className="w-full">Login</Button>
            </form>
        </div>
    );
};

export default LoginForm;