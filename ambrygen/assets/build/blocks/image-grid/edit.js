import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { columns, items } = attributes;
    const blockProps = useBlockProps({ className: 'image-grid-block' });

    const updateItem = (index, key, value) => {
        const newItems = [...items];
        newItems[index][key] = value;
        setAttributes({ items: newItems });
    };

    const addItem = () => {
        setAttributes({ items: [...items, { imageUrl: '', title: '', link: '' }] });
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setAttributes({ items: newItems });
    };

    return (
        <Fragment>
            <div {...blockProps}>
                <PanelBody title={__('Settings', 'ambrygen')} initialOpen={true}>
                    <SelectControl
                        label={__('Columns', 'ambrygen')}
                        value={columns}
                        options={[
                            { label: '1', value: 1 },
                            { label: '2', value: 2 },
                            { label: '3', value: 3 },
                            { label: '4', value: 4 }
                        ]}
                        onChange={(value) => setAttributes({ columns: parseInt(value) })}
                    />
                </PanelBody>

                <div className="grid-items editcodeonly">
                    {items.map((item, index) => (
                        <div className="grid-item-editor" key={index}>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => updateItem(index, 'imageUrl', media.url)}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} isSecondary>
                                            {item.imageUrl ? 'Change Image' : 'Select Image'}
                                        </Button>
                                    )}
                                />
                                {item.imageUrl && <img src={item.imageUrl} alt="" style={{ maxWidth: '100px', display: 'block', margin: '10px 0' }} />}
                            </MediaUploadCheck>

                            <TextControl
                                label={__('Title', 'ambrygen')}
                                value={item.title}
                                onChange={(value) => updateItem(index, 'title', value)}
                            />
                            <TextControl
                                label={__('Link', 'ambrygen')}
                                value={item.link}
                                onChange={(value) => updateItem(index, 'link', value)}
                            />
                            <Button isDestructive onClick={() => removeItem(index)}>
                                {__('Remove Item', 'ambrygen')}
                            </Button>
                        </div>
                    ))}
                    <Button isPrimary onClick={addItem}>
                        {__('Add Item', 'ambrygen')}
                    </Button>
                </div>
            </div>
        </Fragment>
    );
}
console.log("Image Grid Block Edit Loaded");
