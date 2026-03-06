<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" MaintainScrollPositionOnPostback="true" AutoEventWireup="true" CodeFile="ICIA-SERV-01.aspx.cs" Inherits="Forms_ICIA_SERV_01" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="animate__animated p-6">
        <div x-data="sales">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">FORMULARIO: REGISTRO DE CASOS EN OPERATIVOS ANTINARCOTICOS</a></li>
            </ol>
        </div>
        <br />
        <div class="panel">
            <img class="w-20 h-20 rounded-md overflow-hidden object-cover" src="assets/images/icons8-form-64.png" alt="image"/>
            <div class="flex items-center p-3.5 rounded text-white" style="background: rgb(188,26,78); background: linear-gradient(135deg, rgba(188,26,78,1) 0%, rgba(0,79,230,1) 100%);">
                <span class="ltr:pr-2 rtl:pl-2"><strong class="ltr:mr-1 rtl:ml-1">ADMINISTRACION DE CASOS DEL SERVICIO</strong></span>&nbsp;             
            </div>
            <br />
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Codigo de Servicio</div>
                        <asp:TextBox ID="txtcodserv" runat="server" placeholder="" class="form-input form-input-sm" Width="150px" disabled></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Pase</div>
                        <asp:TextBox ID="txtpase" runat="server" placeholder="" class="form-input form-input-sm" Width="150px" disabled></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Departamento</div>
                        <asp:DropDownList ID="ddldpto" runat="server" class="form-select form-select-sm text-white-dark"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ErrorMessage="*" ControlToValidate="ddldpto" InitialValue="Seleccione un Dato" ValidationGroup="codigo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>                    
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Unidad</div>
                        <asp:DropDownList ID="cbounidad" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cbounidad_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" ErrorMessage="*" ControlToValidate="cbounidad" InitialValue="Seleccione un Dato" ValidationGroup="codigo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Distrital</div>
                        <asp:DropDownList ID="cboDistrital" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cboDistrital_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" ErrorMessage="*" ControlToValidate="cboDistrital" InitialValue="Seleccione un Dato" ValidationGroup="codigo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Grupo</div>
                        <asp:DropDownList ID="cboGrupo" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cboGrupo_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" ErrorMessage="*" ControlToValidate="cboGrupo" InitialValue="Seleccione un Dato" ValidationGroup="codigo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">                        
                        <asp:Button ID="Asigcaso" runat="server" Text="ASIGNAR NUMERO DE REGISTRO" class="btn btn-primary btn-sm" OnClick="Asigcaso_Click" ValidationGroup="codigo"/>&nbsp;&nbsp;                        
                        <asp:Label ID="txtnroreg" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="160px"></asp:Label>                        
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre del Operativo</div>
                        <asp:TextBox ID="Txtnombcaso" runat="server" placeholder="" class="form-input form-input-sm" Width="350px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fecha y Hora Operativo</div>
                        <asp:TextBox ID="Txtfechaop" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Quien Realiza la Solicitud (llena el Formulario Operativo)</div>                        
                        <asp:DropDownList ID="ddlsolicita" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="ddlsolicita_SelectedIndexChanged" Width="350"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="*" ControlToValidate="ddlsolicita" InitialValue="Seleccione un Dato" ValidationGroup="guarda" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Celular</div>
                        <asp:Label ID="fonosolicita" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="160px"></asp:Label>                        
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Asignado al Caso</div>
                        <asp:DropDownList ID="ddlasignado" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="ddlasignado_SelectedIndexChanged" Width="350"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="*" ControlToValidate="ddlasignado" InitialValue="Seleccione un Dato" ValidationGroup="guarda" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Celular</div>                        
                        <asp:Label ID="fonoasignado" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="160px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fiscal Asignado</div>
                        <asp:TextBox ID="txtfiscalasignado" runat="server" placeholder="" class="form-input form-input-sm" Width="350px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="*" ControlToValidate="txtfiscalasignado" ValidationGroup="guarda" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Celular</div>
                        <asp:TextBox ID="fonofiscal" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ErrorMessage="*" ControlToValidate="fonofiscal" ValidationGroup="guarda" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                    </div>
                    <div class="flex">
                        <asp:Button ID="GuardarCasReg" runat="server" Text="Guardar Numero de Registro (PIN)" class="btn btn-success" ValidationGroup="guarda" OnClick="GuardarCasReg_Click" />
                    </div>
                </div>
            </div>
            <br />
            <div class="mb-5">
                <asp:GridView ID="CuadroOperativos" runat="server" class="table-responsive" OnRowDeleting="CuadroOperativos_RowDeleting" AutoGenerateColumns="False" Width="100%">
                    <Columns>
                        <asp:BoundField DataField="CO1" HeaderText="Cod. Registro" />
                        <asp:BoundField DataField="CO2" HeaderText="Departamento" />
                        <asp:BoundField DataField="CO3" HeaderText="Unidad" />
                        <asp:BoundField DataField="CO4" HeaderText="Numero de Registro" />
                        <asp:BoundField DataField="CO5" HeaderText="Fecha y Hora del Operativo" />
                        <asp:BoundField DataField="CO6" HeaderText="Nombre del Caso" />
                        <asp:BoundField DataField="CO7" HeaderText="Asignado al Caso" />
                        <asp:BoundField DataField="CO8" HeaderText="Fiscal Asignado al Caso" />
                        <asp:CommandField ButtonType="Image" ShowDeleteButton="True" DeleteImageUrl="~/Forms/assets/images/icons8-trash-bin-32.png" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
    </div>
</asp:Content>