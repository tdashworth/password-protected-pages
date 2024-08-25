import { useState } from "react";
import { Button, Modal } from "flowbite-react";


function EditForm({ open, setOpen } : { open: boolean, setOpen: (value: boolean) => void}) {
    return (
        <Modal
            show={open}
            dismissible={true}
            onClose={() => setOpen(false)}
        >
            <Modal.Header>
                Update Site
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setOpen(false)}>
                    Update site
                </Button>
                <Button
                onClick={() => setOpen(false)}
                    color="red"
                >
                    Delete site
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditForm;