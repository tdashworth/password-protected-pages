import { Badge, Button, Card, Dropdown } from 'flowbite-react'
import { useState } from 'react'
import { AppConfig, SiteConfig } from '../../../functions/_middleware'
import EditForm from './EditForm';

function Portal() {
    const [config, setConfig] = useState<AppConfig>();
    const [searchText, setSearchText] = useState<string>("")
    const [open, setOpen] = useState(false)

    if (config == null)
        return (
            <section
                id="openConfigSection"
                role="status"
                className="h-3/4 flex items-center justify-center"
            >
                <Button onClick={loadConfig}>Open config file to start</Button>
            </section>
        )

    async function loadConfig() {
        const pickerOpts = {
            types: [
                {
                    description: "JSON Config",
                    accept: { "json/*": [".json"] },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        };
        const result = await window.showOpenFilePicker(pickerOpts);
        const file = await result[0].getFile();
        const fileContent = await file.text();
        setConfig(JSON.parse(fileContent));
    }

    const filteredSites = searchText === ""
        ? config?.sites
        : config?.sites?.filter(x => x.slug.includes(searchText))

    return (
        <>
            <div className="mx-auto w-full pt-4">
                <div className="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                    <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">Search</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <input type="text" id="simple-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" value={searchText} onChange={e => setSearchText(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                            <Button onClick={() => setOpen(true)}>
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                                Add site
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid gap-8 mb-6 lg:mb-16 md:grid-cols-2 pt-5'>

                {filteredSites.map(site => (
                    <Card>
                        <div className='flex justify-between align-baseline'>
                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <a href="#">{site.slug}</a>
                            </h3>
                            <Badge color="green">
                                Live
                            </Badge>
                        </div>
                        <p className="mb-4 font-light text-gray-500 dark:text-gray-400">Bonnie drives the technical strategy of the flowbite platform and brand.</p>
                    </Card>
                ))}
            </div>
            <EditForm open={open} setOpen={setOpen} />
        </>

    )
}

export default Portal
