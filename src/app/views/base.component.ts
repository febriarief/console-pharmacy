import { AfterContentInit, Injectable, OnInit } from "@angular/core"
import { ToastrService } from 'ngx-toastr'
import { ModalService } from "../services"

@Injectable()

export abstract class BaseComponent implements OnInit, AfterContentInit
{
	public moduleName!: string
	public mainService: any
	public filter: any
	public moduleFilter: any
	public showForm!: boolean
	public form: any
	public moduleForm: any
	public submiting!: boolean
	public alerts: AlertOptions[]
	public data: any
	public itemsPerPage: number
	public currentPage: number
	public totalItems: number
	public editMode!: boolean
	public loadingData: boolean
	public options: any
    public fakeArray: Array<any>

	constructor(
		public toastrService: ToastrService,
		public modalService: ModalService
	) {
		this.alerts = []
		this.data = []
		this.itemsPerPage = 10
		this.currentPage = 1
		this.totalItems = 0
		this.loadingData = true
        this.fakeArray = new Array(5)
	}

	/**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
	 *
	 * @return void
     */
	ngOnInit(): void {
		this.onAlertClose()
		this.clearFilter()
		this.loadDependencies()
	}

	/**
     * A callback method that is invoked immediately after
     * Angular has completed initialization of all of the directive's
     * content.
     * It is invoked only once when the directive is instantiated.
	 *
	 * @return void
     */
	ngAfterContentInit(): void {
		setTimeout(() => {
			this.loadData()
		}, 150)
	}

	/**
	 * Preparation load data dependencies
	 *
	 * @return void
	 */
	loadDependencies(): void {

	}

	/**
	 * Load resource from main service
	 *
	 * @param page any
	 * @return void
	 */
	loadData(page: any = 1): void {
		if (!this.mainService) return

		this.loadingData = true
		this.filter.page = page

		this.mainService.get(this.filter)
		.subscribe({
			next: (res: any) => {
				if (res.data && res.data.data) {
					this.data = res.data.data
					this.currentPage = page
					this.totalItems = res.data.total
				}

				this.loadingData = false

			},
			error: (err: any) => {
				let errorMessage = 'Cannot get resource data.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this.toastrService.error(errorMessage, 'Error')
				this.loadingData = false
			}
		})
	}

	/**
	 * Reset value of param filter before making a request
	 * to fetch resources.
	 *
	 * @return void
	 */
	clearFilter(reload?: boolean): void {
		this.filter = { ...this.moduleFilter }

		if (reload) setTimeout(() => this.loadData(), 150)
	}

	/**
	 * Show form to add resource
	 *
	 * @return void
	 */
	addData(): void {
		this.onAlertClose()

		this.clearForm()
		this.onAddData()

		setTimeout(() => this.showForm = true, 150)
	}

	/**
	 * Preparation before show main form
	 * to add data
	 *
	 * @return void
	 */
	onAddData(): void {

	}

	/**
	 * Show form to edit data
	 *
	 * @param entry any
	 * @return void
	 */
	editData(entry: any): void {
		this.onAlertClose()

		this.form = { ...entry }
		this.onEditData(entry)

		setTimeout(() => {
			this.editMode = true
			this.showForm = true
		}, 150)
	}

	/**
	 * Preparation before show main form
	 * to edit data
	 *
	 * @return void
	 */
	onEditData(entry: any): void {

	}

	/**
	 * Close main form and back to table list of resources
	 *
	 * @return void
	 */
	closeForm(): void {
		this.showForm = false
		this.editMode = false
	}

	/**
	 * Reset value of object form before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearForm(): void {
		this.form = { ...this.moduleForm }
	}

	/**
	 * Validate main form before submit data
	 *
	 * @returns boolean
	 */
	validate(): boolean {
		return true
	}

	/**
	 * Handle event on save button clicked (save or update)
	 *
	 * @returns void
	 */
	submit(): void {
		if (!this.validate()) return
		this.submiting = true

		if (this.editMode) this.update()
		else this.save()
	}

	/**
	 * Store new data
	 *
	 * @returns void
	 */
	save(): void {
		this.mainService.store(this.form)
		.subscribe({
			next: () => {
				this.afterSave()
				this.closeForm()

				setTimeout(() => {
					this.submiting = false
					this.loadData()
                    this.toastrService.success('Data successfully created.', 'Success')

					// this.alerts.push({
					// 	type: 'success',
					// 	title: 'Success!',
					// 	message: 'Data successfully created.'
					// })

				}, 150)
			},
			error: (err: any) => {
				this.submiting = false
				let errorMessage = 'Cannot create data.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this.toastrService.error(errorMessage, 'Error')
			}
		})
	}

	/**
	 * Action after data succesffuly created
	 *
	 * @return void
	 */
	afterSave(): void {

	}

	/**
	 * Update existing data
	 *
	 * @returns void
	 */
	update(): void {
		this.mainService.update(this.form, this.form.id)
		.subscribe({
			next: () => {
				this.afterUpdate()
				this.closeForm()

				setTimeout(() => {
					this.submiting = false
					this.loadData()
                    this.toastrService.success('Data successfully updated.', 'Success')

					// this.alerts.push({
					// 	type: 'success',
					// 	title: 'Success!',
					// 	message: 'Data successfully updated.'
					// })

				}, 150)
			},
			error: (err: any) => {
				this.submiting = false
				let errorMessage = 'Cannot update data.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this.toastrService.error(errorMessage, 'Error')
			}
		})
	}

	/**
	 * Action after data succesffuly updated
	 *
	 * @return void
	 */
	afterUpdate(): void {

	}

	/**
	 * Delete existing data
	 *
	 * @returns void
	 */
	deleteData(id: number) {
		this.onAlertClose()

		this.modalService.confirm('Are you sure want to delete this data ?', 'Confirmation')
		.then((res: any) => {
			if (res) {
				this.mainService.delete(id)
				.subscribe({
					next: () => {
                        this.toastrService.success('Data successfully deleted.', 'Success')

						// this.alerts.push({
						// 	type: 'success',
						// 	title: 'Success!',
						// 	message: 'Data successfully deleted.'
						// })

						this.loadData()
					},
					error: (err: any) => {
						this.submiting = false
						let errorMessage = 'Cannot delete data.'
						if (err.error && err.error.message) errorMessage = err.error.message
						this.toastrService.error(errorMessage, 'Error')
					}
				})
			}
		})
	}

	/**
	 * Handle event on alert close
	 *
	 * @param args any
	 * @return void
	 */
	onAlertClose(args?: any) {
		this.alerts = []
	}
}

export interface AlertOptions
{
	type: 'error'|'success',
	title: string
	message: string
}
