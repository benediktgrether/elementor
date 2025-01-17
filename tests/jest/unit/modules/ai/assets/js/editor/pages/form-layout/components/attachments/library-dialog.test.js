import { render } from '@testing-library/react';
import {
	LibraryDialog,
} from 'elementor/modules/ai/assets/js/editor/pages/form-layout/components/attachments/library-dialog';
import {
	ATTACHMENT_TYPE_JSON,
} from 'elementor/modules/ai/assets/js/editor/pages/form-layout/components/attachments';

describe( 'LibraryDialog', () => {
	const mockOnAttach = jest.fn();
	const mockRun = jest.fn();

	global.$e = { run: mockRun };

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'should add and remove event listener', () => {
		const addSpy = jest.spyOn( window, 'addEventListener' );
		const removeSpy = jest.spyOn( window, 'removeEventListener' );

		const { unmount } = render( <LibraryDialog onAttach={ mockOnAttach } /> );

		expect( addSpy ).toHaveBeenCalledWith( 'message', expect.any( Function ) );

		unmount();

		expect( removeSpy ).toHaveBeenCalledWith( 'message', expect.any( Function ) );
	} );

	it( 'should handle library/attach message', () => {
		render( <LibraryDialog onAttach={ mockOnAttach } /> );
		const event = new MessageEvent( 'message', {
			data: {
				type: 'library/attach',
				json: { some: 'data' },
				html: '<div>Preview</div>',
				label: 'Test - How you doing?',
			},
		} );

		window.dispatchEvent( event );

		expect( mockOnAttach ).toHaveBeenCalledWith( [ {
			type: ATTACHMENT_TYPE_JSON,
			previewHTML: '<div>Preview</div>',
			content: { some: 'data' },
			label: 'Test - How you doing?',
		} ] );
	} );

	it( 'should not handle other message types', () => {
		render( <LibraryDialog onAttach={ mockOnAttach } /> );
		const event = new MessageEvent( 'message', {
			data: { type: 'otherType' },
		} );

		window.dispatchEvent( event );

		expect( mockOnAttach ).not.toHaveBeenCalled();
	} );

	it( 'should call $e.run with correct arguments', () => {
		render( <LibraryDialog onAttach={ mockOnAttach } /> );

		expect( mockRun ).toHaveBeenCalledWith( 'library/open', {
			toDefault: true,
			mode: 'ai-attachment',
		} );
	} );
} );
