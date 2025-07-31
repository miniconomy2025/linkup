import { PageLayout } from '../pageLayout/PageLayout';
import './LoadingSpinner.css';

export const LoadingSpinner = () => {
    return <span className='loader'></span>
};

export const LoadingPage = () => {
    return (
        <PageLayout>
            <div className='loading-spinner-container'>
                <LoadingSpinner />
            </div>
        </PageLayout>
    );
};